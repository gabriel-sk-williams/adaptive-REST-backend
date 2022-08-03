import * as THREE from "three";
import React, { Component } from "react";
import { BufferGeometryUtils } from "./util/BufferGeometryUtils.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as TWEEN from "es6-tween";
import axios from "axios";
import { requestHandler } from "./util/axiosAPI.js";

import Interface from "./Interface.js";
import metaJSON from "./meta/atx_meta.json";
import layerJSON from "./meta/atx_layer.json";
import datumJSON from "./meta/atx_datum.json";

import util from "./util/Util.js";
import mat from "./util/Materials.js";


class Modeler extends Component {

  constructor() {
    super();
    this.state = {
      layers: layerJSON.layer,
      meta: metaJSON.meta,
      datum: datumJSON.datum,
      activeTab: "Model",
      activeScale: "Region",
      expanded: false,
      focus: false,
      viewModel: false,
      view3D: true,
      
      // isLoading: true, // figure out how to use this
      selected: null,
      hovered: null,

      search: {
        view: false,
        type: "",
        query: ""
      },

      model: {
        equation: "density",
        mode: "existing",
        param: "total",
      },

      density: {
        v0: 1050,
        vx: 576.25,
        g: 0.3,
        x: datumJSON.datum["radius:km"]
      },
    }
  }

  componentDidMount() {
    this.init();
    window.addEventListener("resize", this.handleWindowResize);
    window.addEventListener("keydown", this.handleKeyDown);
    this.renderer.domElement.addEventListener("mousemove", this.onMouseMove, true);
    this.renderer.domElement.addEventListener("click", this.onMouseClick, false);
    this.renderer.domElement.addEventListener("dblclick", this.onDoubleClick, true);
  }

  // use this.val only when performing operations leading to intermediate state
  init = () => {
    this.requestHandler = new requestHandler();
    this.materials = {};
    this.environment = {};
    this.picker = 0x000000;
    this.scene = new THREE.Scene();
    this.HOVER_MESH = new THREE.Mesh();
    this.HOVER_POINT = new THREE.Points();
    this.HOVER = new THREE.Mesh();
    this.SELECT_MESH = new THREE.Mesh();
    this.SELECT_POINT = new THREE.Points();
    this.SELECT = new THREE.Mesh();
    this.SELECT_FRAME = new THREE.LineSegments();
    this.GHOST = new THREE.Mesh();
    this.SEARCH = new THREE.Mesh();
    this.gpuScene = new THREE.Scene();
    this.gpuWindow = new THREE.WebGLRenderTarget(1,1);
    this.mouse = new THREE.Vector2();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 400000);
    this.camera.position.set(6862, 18013, 32393);
    this.controls = new OrbitControls(this.camera, this.el);
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      autoClear: false,
      preserveDrawingBuffer: true,
      premultipliedAlpha: false,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.el.appendChild(this.renderer.domElement); // mount using React ref
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
      hemiLight.color.setHSL(0.1, 1, 1);
      hemiLight.position.set(0, 250, -500);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
      dirLight.color.setHSL(0.1, 1, 0.95);
      dirLight.position.set(250, 500, 400);
      dirLight.target.position.set(500, 0, 0);
    this.scene.add(hemiLight);
    this.scene.add(dirLight);
    this.scene.add(this.HOVER);
    this.scene.add(this.HOVER_MESH);
    this.scene.add(this.HOVER_POINT);
    this.scene.add(this.SELECT);
    this.scene.add(this.SELECT_MESH);
    this.scene.add(this.SELECT_POINT);
    this.scene.add(this.GHOST);
    this.scene.add(this.SEARCH);
    this.scene.add(this.SELECT_FRAME);

    this.initLayers();
    this.animate();
  };

  //
  // **LOADING CALLS**
  //

  initLayers = () => {
    let { layers } = this.state;
    for (let i = 0; i < layers.length; i++) { // layers.length
      let meta = layers[i];
      //let meta = layers[8];
      this.genProfile(meta);
      this.getLayer(meta);
    }
  }

  /*
  initLayers = () => {
    let { layers } = this.state;
    let meta = layers[10];
    this.genProfile(meta);
    this.getLayer(meta);
    let guetta = layers[13];
    this.genProfile(guetta);
    this.getLayer(guetta);
  }
  */

  genProfile = (meta) => {
    let matProfile = mat.profile(meta);
    let envProfile = { mesh: {}, frame: {}, gpu: {} };
    let [ mainID, subID ] = meta.key;

    if (!this.materials[mainID]) this.materials[mainID] = {};
    if (!this.environment[mainID]) this.environment[mainID] = {};

    if (subID) {
      this.materials[mainID][subID] = matProfile;
      this.environment[mainID][subID] = envProfile;
    }else{
      this.materials[mainID] = matProfile;
      this.environment[mainID] = envProfile;
    }
  }

  getLayer = (meta) => {
    let { layer, subtype } = meta;

    for (let j = 0; j < subtype.length; j++) {
      let type = `${subtype[j]}`;
      let url = "http://localhost:3000/" + layer + '/' + type;
      axios.get(url)
      .then(response => {
        let recs = response.data.records;
        if (recs.length) {
          let buffer = recs[0]["_fields"][0];
          this.loadVisual(meta, buffer, type)
        }
      });
    }
  }

  loadVisual = (meta, buffer, subtype) => {

    const { key, visible, mesh, layer } = meta;
    const env = this.accessLayer(key);
    const material = this.accessMaterial(key);

    const mergedBuffer = mesh === "Point" 
      ? this.pointGPU(env, meta, buffer, subtype) 
      : mesh === "Path"
      ? this.pathGPU(env, meta, buffer, subtype)
      : this.meshGPU(env, meta, buffer, subtype);


    if (mesh === "Point") {
      mergedBuffer.computeBoundingSphere();
      //console.log(mergedBuffer.boundingSphere.radius);
      let pointCloud = new THREE.Points(mergedBuffer, material.base[subtype]);
      env.mesh[subtype] = pointCloud;
      env.mesh[subtype].visible = visible;
      this.scene.add(pointCloud);
    }else{

      if (mesh === "Mesh" || layer === "parcel" || layer === "hexagon") {
        let mergedEdges = new THREE.EdgesGeometry(mergedBuffer);
        let mergedFrame = new THREE.LineSegments(mergedEdges, material.edge);
        env.frame[subtype] = mergedFrame;
        env.frame[subtype].visible = visible;
        this.scene.add(mergedFrame);
      }

      // add vertex colors
      if (mesh === "Mesh" || mesh === "Morph") {
        let basehex = material.base[subtype].name;
        let vertColors = mesh === "Morph" 
          ? mat.getVertColors(mergedBuffer, basehex, 0x74339a) // basehex 0xa03ca0
          : mat.getVertColors(mergedBuffer, basehex);

        mergedBuffer.setAttribute("color", vertColors); // purple
        
        if (mesh === "Morph") {
          let yellowAttr = mat.getVertColors(mergedBuffer, 0xffd200, 0xe4a900);
          let blueAttr = mat.getVertColors(mergedBuffer, 0x5aa9e6, 0x157ac7); // 0xbed2ff);
          let greenAttr = mat.getVertColors(mergedBuffer, 0x8fc93a, 0x548908);
          mergedBuffer.setAttribute("morphColor0", yellowAttr); // will get switched
          mergedBuffer.setAttribute("morphColor1", blueAttr);
          mergedBuffer.setAttribute("morphColor2", yellowAttr);
          mergedBuffer.setAttribute("morphColor3", blueAttr);
          mergedBuffer.setAttribute("morphColor4", greenAttr);
        }

        let mergedMesh = new THREE.Mesh(mergedBuffer, material.base[subtype]);
        env.mesh[subtype] = mergedMesh;
        env.mesh[subtype].visible = visible;
        this.scene.add(mergedMesh);
      }else{
        let mergedMesh = new THREE.Mesh(mergedBuffer, material.base[subtype]);
        env.mesh[subtype] = mergedMesh;
        env.mesh[subtype].visible = visible;
        this.scene.add(mergedMesh);
      }
    }
  }

  meshGPU = (env, meta, buffer, subtype) => {
    const { visible, mesh } = meta;
    var mergeArray = [];
    var meshIndex = {};

    for (let key in buffer) {
      let bufferGeometry = util.loadBuffer(mesh, buffer[key]);
      mergeArray.push(bufferGeometry);

      let bufferMesh = new THREE.Mesh(bufferGeometry, mat.getGPU(key));
      bufferMesh.visible = visible;
      bufferMesh.name = subtype;

      meshIndex[key] = bufferMesh.geometry.attributes.position.count;

      env.gpu[key] = bufferMesh;
      this.gpuScene.add(bufferMesh);
      // this.scene.add(bufferMesh);
    }

    let mergedBuffer = BufferGeometryUtils.mergeBufferGeometries(mergeArray, true);
    mergedBuffer.meshIndex = meshIndex;
    return mergedBuffer;
  };

 pathGPU = (env, meta, buffer, subtype) => {
    const { visible, mesh } = meta;
    var pathArray = [];
    
    for (let key in buffer) {
      let pathData = buffer[key];
      let bufferGeometry = util.loadBuffer(mesh, pathData);
      pathArray.push(bufferGeometry);

      let bufferTube = util.loadBufferTube(pathData);
      let pathMesh = new THREE.Mesh(bufferTube, mat.getGPU(key));
      pathMesh.visible = visible;
      pathMesh.name = subtype;

      env.gpu[key] = pathMesh;
      this.gpuScene.add(pathMesh);
    }

    let mergedPaths = BufferGeometryUtils.mergeBufferGeometries(pathArray, true);
    return mergedPaths;
  }

  pointGPU = (env, meta, buffer, subtype) => {
    
    const PARTICLE_SIZE = 99;
    const positions = [];
    const sizes = [];
    
    for (let key in buffer) {
      let bufferData = buffer[key];
      Array.prototype.push.apply(positions, bufferData.position);
      sizes.push(PARTICLE_SIZE);

      let bufferSphere = util.loadBufferSphere(bufferData, 35, 4);
      let pointMesh = new THREE.Mesh(bufferSphere, mat.getGPU(key));
      pointMesh.visible = meta.visible;
      pointMesh.name = subtype;
      pointMesh.datum = (bufferData.position);

      env.gpu[key] = pointMesh;
      this.gpuScene.add(pointMesh);
    }

    const pointCloud = new THREE.BufferGeometry();
    pointCloud.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    pointCloud.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
    return pointCloud;
  };

    //
  // **RECEIVE OBJECTS FROM CHILDREN**
  //

  receiveScale = (newScale) => { this.setState({ activeScale: newScale }); }
  receiveTab = (newTab) => { this.setState({ activeTab: newTab }); }
  receiveMenuObj = (menuObj) => {
    this.state.activeTab === "Model"
    ? this.receiveModel(menuObj)
    : this.state.activeTab === "Layers"
    ? this.receiveLayer(menuObj)
    : this.state.activeTab === "Search"
    ? this.receiveSearch(menuObj)
    : console.log("menu error");
  }

  receiveModel = (model) => {
    this.setState({
      viewModel: true,
      model: model
    }, () => {
      const { equation, mode, param } = this.state.model;
      this.renderMonocentric(this.state.viewModel, equation, mode, param); 
    });
  }

  receiveLayer = (layerObj) => {
    console.log(layerObj);
    this.setState({
      layer: layerObj,
    }, () => {
      for (let l = 0; l < layerObj.length; l++) {
        const { key, subtype, visible, hover } = layerObj[l];
        this.renderLayer(key, subtype, visible, hover);
      }
    });
  }

  receiveSearch = (searchObj) => {
    let { view, type, query } = searchObj;
    this.setState({ 
      search: searchObj,
    }, () => {
      if (view) {
        this.renderSearch(type, query);
      }else{
        this.clearSearch();
      }
    }); 
  }

  // comes from density sliders
  receiveDensity = (density) => {
    this.setState({
      density: density
    }, ()=> {
      const { equation, mode, param } = this.state.model;
      this.renderMonocentric(this.state.viewModel, equation, mode, param); 
    })
  }

  renderLayer = (key, subtypes, visible, hover) => {

    const toggleGPU = (gpu, visible) => {
      for (let key in gpu) {
        gpu[key].visible = visible;
      }
    }

    console.log("render", key);
    const env = this.accessLayer(key);
    const material = this.accessMaterial(key);

    if (env && env.mesh && material) {

      for (let k = 0; k < subtypes.length; k++) {
        let type = subtypes[k];
        if (typeof env.mesh[type] == "undefined") continue;

        if (visible && hover) { // hover material
          env.mesh[type].visible = visible;
          env.mesh[type].material = material.hover[type];          
          if (env.frame[type]) env.frame[type].visible = visible;
          toggleGPU(env.gpu, visible);
        }else if (visible && !hover) { // revert to base
          env.mesh[type].visible = visible;
          env.mesh[type].material = material.base[type];
          if (env.frame[type]) env.frame[type].visible = visible;
          toggleGPU(env.gpu, visible);
        }else if (!visible && hover) { // if !visible: make temporarily 'ghosted'
          env.mesh[type].visible = true;
          env.mesh[type].material = material.ghost[type];
        }else if (!visible && !hover) { // revert to invisible
          env.mesh[type].visible = visible;
          if (env.frame[type]) env.frame[type].visible = visible;
          toggleGPU(env.gpu, visible);
        }
      }
    }
  }

  isolate = (...args) => {
    const layers = this.state.layers.slice();
    for (let i = 0; i < layers.length; i++) {
      let { layer } = layers[i];
      layers[i].visible = args.includes(layer) ? true : false;
    }
    this.receiveLayer(layers);
  }

  toggleLayer = (layer, state) => {
    const layers = this.state.layers.slice();
    const [ metaObj ] = layers.filter(obj => { return obj.layer === layer });
    const { id, key, subtype } = metaObj;
    layers[id].visible = state;

    this.setState({
      layer: layers
    }, () => {
      this.renderLayer(key, subtype, state, false);
    });
  }

  //
  // **RENDER CALLS**
  //

  // have viable key
  // search children
  renderHover = (hex) => {  
    let material = this.accessMaterial(hex);
    let env = this.accessLayer(hex);
    let { datum, geometry, name } = env.gpu[hex];
    let { mesh, hover } = material;
    
    this.HOVER = mesh === "Point" ? this.HOVER_POINT : this.HOVER_MESH;
    this.HOVER.geometry = mesh === "Point" ? util.loadBufferPoint(datum) : geometry;
    this.HOVER.material = hover[name]; // name is assigned subtype
    this.HOVER.visible = true;
    this.HOVER_MESH.visible = mesh === "Point" ? false : true;
    this.HOVER_POINT.visible = mesh === "Point" ? true : false;
    this.getNodeByHex(hex);
  }

  getNodeByHex = (hex) => {
    let hexCode = `${hex}`;
    if (this.state.hovered) this.requestHandler.resetCancelToken();
    this.requestHandler.getNode(hexCode)
      .then((props) => {
        if (props.key === this.picker) this.setState({ hovered: props });
      });
  }

  renderSelect = (node) => {
    if (node) {
      const { key, subtype } = node;
      const { select, mesh, edge } = this.accessMaterial(key);
      const env = this.accessLayer(key);
      let { datum, geometry } = env.gpu[key];

      this.SELECT = mesh === "Point" ? this.SELECT_POINT : this.SELECT_MESH;
      this.SELECT.geometry = mesh === "Point" ? util.loadBufferPoint(datum) : geometry;
      this.SELECT.material = select[subtype];
      this.SELECT.renderOrder = 999;

      if (mesh === "Mesh") {
        this.SELECT_FRAME.geometry = new THREE.EdgesGeometry(this.SELECT.geometry); 
        this.SELECT_FRAME.material = edge;
        this.SELECT_FRAME.visible = true;
      }else{
        this.SELECT_FRAME.visible = false;
      }
      
      this.SELECT.visible = true;
      this.SELECT_MESH.visible = mesh === "Point" ? false : true;
      this.SELECT_POINT.visible = mesh === "Point" ? true : false;

    }else{
      this.SELECT.visible = false;
      this.SELECT_FRAME.visible = false;
    }
  }
  
  /*
  api.get("/node/:hex", routes.node.getNodeByHex);
  api.get("/node/:lemma", routes.node.getNodeByLemma);
  api.get("/node/:address", routes.node.getNodeByAddress);
  api.get("/node/:name", routes.node.getNodeByName);
  */

  renderSearch = (type, query) => {
    let url = "http://localhost:3000/" + type + "/" + query;
    axios.get(url)
      .then(response => {
        let recs = response.data.records;
        if (recs.length) {
          let keys = recs.map(rec => rec._fields[0]);
          let mat = this.accessMaterial("0");
          let env = this.accessLayer("0");
          let searchBuffer = keys.map(key => env.gpu[key].geometry)
          let mergedSearch = BufferGeometryUtils.mergeBufferGeometries(searchBuffer);
          this.SEARCH.geometry = mergedSearch;
          this.SEARCH.material = mat.search;
          this.SEARCH.renderOrder = 500;
          this.SEARCH.visible = true;
        }
      })
  };

  clearSearch = () => {
    this.SEARCH.visible = false;
  }

  //
  // ** RENDER MONOCENTRIC**
  //

  // renders monocentric model
  renderMonocentric = (active, eq, mode, param) => {
    if (active) {
      this.toggleLayer("graph", true);
      switch(eq) {
        case "density": this.monoDensity(mode, param);
          break;
        case "land value": this.monoDensity(mode, param);
          break;
        default: 
          break;
      }
    }else{
      this.toggleLayer("graph", false);
    }
  }

  monoDensity = (mode, param) => {
    // this.isolate("hex", "street", "block", "graph");
    switch(mode) {
      case "existing": this.morphGraph(param);
        break;
      case "expected": this.morphGraph(mode);
        break;
      case "distortion":
        break;
      default:
        break;
    }
  }

  monoLandValue = (mode) => { }

  // MORPH FUNCTIONS
  morphGraph = (morph) => {
    const env = this.environment["c"];
    const gpuMesh = env.gpu;
    const graphMesh = env.mesh.population;
    const influences = graphMesh.morphTargetInfluences;
    const prevState = influences[0] ? "residential"
    : influences[1] ? "office"
    : influences[2] ? "expected"
    : "total";

    if (prevState === morph) return;

    let resColor = graphMesh.geometry.getAttribute('morphColor2');
    let offColor = graphMesh.geometry.getAttribute('morphColor3');
    let expColor = graphMesh.geometry.getAttribute('morphColor4');

    // gpu morph
    for (let key in gpuMesh) {
    gpuMesh[key].updateMorphTargets();
    if (morph === "residential") {
        gpuMesh[key].morphTargetInfluences[0] = 1;
    }else if (morph === "office") {
        gpuMesh[key].morphTargetInfluences[1] = 1;
    }else if (morph === "expected") {
        gpuMesh[key].morphTargetInfluences[2] = 1;
    }
    }
    
    if (prevState === "total") {
    if (morph === "residential") graphMesh.geometry.setAttribute('morphColor0', resColor);
    if (morph === "office") graphMesh.geometry.setAttribute('morphColor0', offColor);
    if (morph === "expected") graphMesh.geometry.setAttribute('morphColor0', expColor);
    }
    
    // morphTargets SEEM to favor original placement
    if (prevState === "residential") { // natural morph0: yellow
    if (morph === "office") graphMesh.geometry.setAttribute('morphColor1', offColor);
    if (morph === "expected") graphMesh.geometry.setAttribute('morphColor1', expColor);
    }

    if (prevState === "office") { // natural morph1: blue
    if (morph === "residential") graphMesh.geometry.setAttribute('morphColor0', resColor);
    if (morph === "expected") graphMesh.geometry.setAttribute('morphColor1', expColor);
    }
    
    // graph morph
    new TWEEN.Tween({ morph: 0.0, revert: 1.0 }).to({ morph: 1.0, revert: 0.0 }, 750)
    .easing(TWEEN.Easing.Sinusoidal.Out)
    .on("update", function () {
    if (prevState === "residential") { // [1,0,0]
        influences[0] = this.object.revert;
    }else if (prevState === "office") { // [0,1,0]
        influences[1] = this.object.revert;
    }else if (prevState === "expected") { // [0,0,1]
        influences[2] = this.object.revert;
    }

    if (morph === "residential") { // [1,0,0]
        influences[0] = this.object.morph;
    }else if (morph === "office") { // [0,1,0]
        influences[1] = this.object.morph;
    }else if (morph === "expected") { // [0,0,1]
        influences[2] = this.object.morph;
    }
    })
    .on("complete", function () { // unused influences collapse to morphTarget0
    if (morph === "residential") graphMesh.geometry.setAttribute('morphColor0', resColor);
    if (morph === "office") graphMesh.geometry.setAttribute('morphColor0', offColor);
    if (morph === "expected") graphMesh.geometry.setAttribute('morphColor0', expColor);
    })
    .start();
  }

  // **ACCESS, ANIMATION, CONTROLS, TOGGLES**
  toggleModel = () => { 
    this.setState(prevState => ({ 
      viewModel: !prevState.viewModel 
    }), () => { 
      const { equation, mode, param } = this.state.model;
      this.renderMonocentric(this.state.viewModel, equation, mode, param); 
    });
  }

  toggle3D = () => { this.setState(prevState => ({ view3D: !prevState.view3D })); }

  onMouseClick = (event) => { /*console.log(this.environment);*/ }

  onDoubleClick = () => {
    this.setState({ 
      selected: this.state.hovered,
      focus: false
    }, () => {
      this.renderSelect(this.state.selected);
    });
  }

  accessMaterial = (key) => { // id is first two chars
    let [ mainID, subID ] = key;
    return ( 
      subID !== undefined && this.materials[mainID][subID] 
      ? this.materials[mainID][subID] 
      : this.materials[mainID]
    );
  }

  accessLayer = (key) => { // id is first two chars
    let [ mainID, subID ] = key;
    return ( 
      subID !== undefined && this.environment[mainID][subID]
      ? this.environment[mainID][subID] 
      : this.environment[mainID]
      ? this.environment[mainID]
      : null
    );
  }

  pick = () => {
    this.camera.setViewOffset( // set subcam to single pixel under mouse
      this.renderer.domElement.width, 
      this.renderer.domElement.height, 
      this.mouse.x * window.devicePixelRatio | 0, 
      this.mouse.y * window.devicePixelRatio | 0, 
      1, 1 
    );
    
    this.renderer.setRenderTarget( this.gpuWindow );
    this.renderer.render( this.gpuScene, this.camera );
    var pixelBuffer = new Uint8Array(4); // create buffer to read single pixel
    this.camera.clearViewOffset(); // clear view offset - returns rendering to normal
    this.renderer.readRenderTargetPixels(this.gpuWindow, 0, 0, 1, 1, pixelBuffer);

    let hex = pixelBuffer
      .slice(0, -1) // remove alpha channel from rgba
      .reduce((str, byte) => str + byte.toString(16).padStart(2, "0"), ""); // convert rgb->hex
    
    if (hex !== this.picker) {
      this.picker = hex;
      if (hex.charAt(0) === "a" || hex === "000000") {
        this.HOVER.visible = false;
        this.setState({ hovered: false });
      }else{
        this.renderHover(hex);
      }
    }
  }

  onMouseMove = (event) => {
    event.preventDefault();
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("keydown", this.handleKeyDown)
    window.cancelAnimationFrame(this.requestID);
    this.controls.dispose();
  }

  handleWindowResize = () => {
    const width = this.el.clientWidth;
    const height = this.el.clientHeight;

    this.renderer.setSize(width, height);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  };

  handleKeyDown = (event) => {
    const F_KEY = 70;
    const ENTER_KEY = 13;
    const E_KEY = 69;
    const M_KEY = 77;
    const SPACE_KEY = 32;
    switch(event.keyCode) {
      case F_KEY:
        if (this.state.selected) this.focus(this.state.selected);
        break;
      case ENTER_KEY:
        this.searchFocus();
        break;
      case M_KEY:
        console.log(this.materials);
        break;
      case E_KEY:
        console.log(this.environment);
        break;
      case SPACE_KEY:
        console.log(this.state.hovered)
        break;
      default: 
        break;
    }
  }

  searchFocus = () => { /*let searched = this.SEARCH.geometry;*/ }

  focus = (obj) => {
    const self = this;
    this.setState(prevState => ({
      focus: !prevState.focus 
    }), () => {
      if (this.state.focus) {
        // let obj = this.state.selected;
        let posX = obj.centroid[0];
        let posZ = -obj.centroid[1];
        let posY = obj.height && obj.height instanceof Array
          ? obj.height[0]
          : obj.height
          ? Math.max(obj.height, 200) 
          : 275;

        const gpX = Math.sign(self.camera.position.x)
        const gpZ = Math.sign(self.camera.position.z)

        var fromCam = {
          x : self.camera.position.x,
          y : self.camera.position.y,
          z : self.camera.position.z
        };

        var toCam = {
          x : posX + (1200 * gpX),
          y : posY + 1800,
          z : posZ + (1200 * gpZ)
        };

        var fromTarget = {
          x : self.controls.target.x,
          y : self.controls.target.y,
          z : self.controls.target.z
        };

        var toTarget = {
          x : posX,
          y : posY / 2,
          z : posZ
        };
        
        new TWEEN.Tween(fromCam).to(toCam, 1500)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .on("update", function () {
            self.camera.position.set(this.object.x, this.object.y, this.object.z);
            self.camera.lookAt(posX,posY/2,posZ);
          })
          .on("complete", function () {
            self.camera.lookAt(posX,posY/2,posZ);
            self.camera.updateProjectionMatrix();
          })
          .start()
        
        new TWEEN.Tween(fromTarget).to(toTarget, 1500)
          .easing(TWEEN.Easing.Sinusoidal.Out)
          .on("update", function () {
            self.controls.target.set(this.object.x, this.object.y, this.object.z);
          })
          .on("complete", function () {
            self.controls.target.set(posX, posY/2, posZ);
          })
          .start()
      }
    }); 
  }

  animate = () => { // don't change the order
    TWEEN.update();
    this.controls.update();
    this.camera.updateProjectionMatrix();
    this.renderer.setRenderTarget( null );
    this.renderer.render(this.scene, this.camera);
    this.pick();
    this.requestID = window.requestAnimationFrame(this.animate);
  };

  render() {
    return (
      <div>
        <Interface  
          layer={this.state.layers}
          meta={this.state.meta}
          focused={this.state.focus}
          selected={this.state.selected}
          hovered={this.state.hovered}
          density={this.state.density}
          expanded={this.state.expanded}

          hlLayer={this.hlLayer}
          focus={this.focus}
          returnDensity={this.receiveDensity}
          returnMenuObj={this.receiveMenuObj}
          returnTab={this.receiveTab}
          returnScale={this.receiveScale}
          toggleModel={this.toggleModel}
          toggle3D={this.toggle3D} 
        />
        <div ref={ref => (this.el = ref)} />
      </div>
    );
  }
}

export default Modeler;