import * as THREE from "three";
import { MeshLineMaterial } from "three.meshline";

//
// UTILITY FUNCTIONS FOR USE BY MODELER
//

/*
const ygreen = 0x8FC93A;
const citrine = 0xe4cc37;

const thistle = 0xd7c0d0;

const orchid = 0xf7c7db;
const medgrey = 0xb7b7b7;
*/


const mystic = 0xd65780;
const baker = 0xfe90ad;
const orange = 0xfbaf00;
// const cyber = 0xffd639;
const cyber = 0xe4cc37;

const garage = 0x84837e;
const coffee = 0x3e363f;
const wolf = 0xdfdad3;
const grey = 0xdfdad3;
const darkgrey = 0xa9a9a9; // 0x4e4d5c;
const sand = 0xfef9ea;
const parcel = 0xa8a8a8;

const plum = 0x9c89b8;
const park = 0x8fc93a; // light-adjusted version of 0x8fc93a; 
const tree = 0x628b48;

const bluejay = 0x5aa9e6;
const water = 0x5aa9e6; // light-adjusted version of bluejay;
const azul = 0x2a628f;
const thistle = 0xd7c0d0;

const mat = {

	profile: function (meta) {
		const { mesh, layer, subtype } = meta;
		let profile = {};
		profile.base = mesh === "Morph"
			? this.getMorph(layer, subtype)
			: mesh === "Mesh"
			? this.getMesh(layer, subtype)
			: mesh === "Shape"
			? this.getShape(layer, subtype)
			: mesh === "Path"
			? this.getPath(layer, subtype)
			: this.getPoint(layer, subtype);
		if (mesh !== "Point") profile.edge = this.getEdge(layer);
		profile.mesh = mesh;
		profile.ghost = this.getGhost(mesh, subtype);
		profile.hover = this.getHover(mesh, subtype);
		profile.select = this.getSelect(mesh, subtype);
		profile.search = this.getSearch(mesh);
		
		return profile;
	},

	getScene: function (component) {
		return (
			component === "scene"
			? new THREE.Color(0x778899)
			: component === "scope"
			? new THREE.MeshLambertMaterial({ 
				color: 0xd3d3d3, 
				side: THREE.DoubleSide,
			})
			: new THREE.MeshLambertMaterial({ color: 0x000000, side: THREE.DoubleSide })
		);
	}, 
	// a4aaba
	// bbb9c4

	monocentric: function (layer) {

		return (
			layer === "scope" 
			? new THREE.MeshLambertMaterial({ 
				color: 0x000000,
				side: THREE.DoubleSide,
				opacity: 0.5,
				transparent: true
			})
			: layer === "frame" 
			? new MeshLineMaterial({ 
				color: new THREE.Color(0xd3d8e0),
				sizeAttenuation: 1,
				lineWidth: 10,
				}) 
			: layer === "buttress" 
			? new THREE.MeshLambertMaterial({ 
				color: 0x000000, 
				side: THREE.DoubleSide, 
				opacity: 0.5, 
				transparent: true,
				morphTargets: true
			})
			: new THREE.MeshLambertMaterial({ color: 0x000000 })
		);
	},

	// type === "DMU" ? 0xa03ca0 // purple
	// type === "SF-3" ? 0xffd200 // yellow
	// type === "P" ? 0xbed2ff // blue
	// type === "CC" ? ffb4dc // pink

	getMorph: function (layer, subtypes) {
		// console.log(`morph${layer}`);
		let base = {};
		for (let i = 0; i < subtypes.length; i++) {
			let type = subtypes[i];
			let hex = 0xa03ca0; // purple

			let lambo = new THREE.MeshLambertMaterial({
				name: hex, // name or id to store color
				vertexColors: true,
				morphTargets: true,
			})

			lambo.onBeforeCompile = (shader) => { 
				shader.vertexShader = lambovt;
				// shader.fragmentShader = lambofrag;
			}

			base[type] = lambo;
		}
		return base;
	},

	getMesh: function (layer, subtypes) {
		let base = {};

		for (let i = 0; i < subtypes.length; i++) {
			let type = subtypes[i];
			let color = 
				layer === "building" && type === "construction" ? coffee
				: layer === "building" ? 0xc8c8c8
				: layer === "parking" ? 0xa8a8a8
				: layer === "capacity" ? this.getZoningColor(type)
				: 0x000000;
			let transparent = type === "construction" ? true : false; // || type === "population"
			let opacity = transparent ? 0.75 : 1;
			
			base[type] = new THREE.MeshLambertMaterial({
				name: color, // name or id to store color
				vertexColors: true,
				morphTargets: true,
				transparent: transparent,
				opacity: opacity
			})
		}

		return base;
	},

	getShape: function (layer, subtypes) {
		let base = {};

		for (let i = 0; i < subtypes.length; i++) {
			let type = subtypes[i];
			let color = 
				layer === "locale" && type === "park" ? park
				: layer === "locale" && type === "water" ? water
				: layer === "locale" && type === "sand" ? sand
				: layer === "locale" && type === "pedestrian" ? thistle
				: layer === "locale" && type === "campus" ? wolf
				: layer === "hexagon" ? 0xe1e1e1
				: layer === "block" ? 0xebebeb
				: layer === "parcel" ? parcel
				: layer === "zoning" ? this.getZoningColor(type)
				: 0x000000;

			// offset prevents some z-fighting. not fully fixed
			let offset = 
				layer === "parcel" ? 0.0
				: layer === "zoning" ? 0.0
				: layer === "location" && type === "park" ? -1.0
				: layer === "location" && type !== "park" ? -0.5
				: layer === "block" ? 1.0
				: 0;
			
			let transparent = layer === "hexagon" ? true : false;
			let opacity = 
				layer === "hexagon" && type === "unloaded" ? 0.25
				: layer === "hexagon" && type === "loaded" ? 0.25
				: 1.0;

			base[type] = new THREE.MeshBasicMaterial({
				color: color, 
				side: THREE.DoubleSide,
				polygonOffset: true,
				polygonOffsetFactor: offset,
				transparent: transparent,
				opacity: opacity,
			});
			
		}
		return base;
	},

	getPath: function (layer, subtypes) {
		let base = {};
		for (let i = 0; i < subtypes.length; i++) {
			let type = subtypes[i];
			let color = 
				layer === "street" ? darkgrey
				: layer === "transit_path" && type === "bus" ? orange
				: layer === "transit_path" && type === "bicycle" ? mystic
				: layer === "transit_path" && type === "train" ? mystic
				: layer === "transit_path" && type === "rail" ? mystic
				: layer === "natural_path" ? 0x374785
				: layer === "footway" ? 0x9932cc
				: layer === "edge" ? 0xd3d8e0
				: layer === "edgechain" ? 0xff0000
				: 0x000000;
			
			let width = 
				layer === "street" && type === "motorway" ? 50
				: layer === "street" && type === "primary" ? 35
				: layer === "street" && type === "secondary" ? 30
				: layer === "street" && type === "tertiary" ? 25
				: layer === "street" && type === "residential" ? 16
				: layer === "street" ? 12
				: layer === "transit_path" && type === "bus" ? 30
				: layer === "transit_path" ? 15
				: layer === "natural_path" ? 10
				: layer === "footway" ? 12
				: layer === "edge" ? 10
				: 10;

			base[type] = new MeshLineMaterial({
				color: color,
				sizeAttenuation: 1,
				lineWidth: width
			})
		}
		return base;
	},

	// currently applies latter material to entire mesh
	getPoint: function (layer, subtypes) {
		let base = {};
		for (let i = 0; i < subtypes.length; i++) {
			let type = subtypes[i];
			let color = 
				layer === "osm_point" && type === "address" ? grey
				: layer === "osm_point" && type === "amenity" ? plum
				: layer === "osm_point" && type === "natural" ? tree
				: layer === "osm_point" && type === "parking" ? garage
				: layer === "osm_point" && type === "infrastructure" ? cyber
				: layer === "transit_point" && type === "bicycle" ? orange
				: layer === "transit_point" && type === "bus" ? orange
				: 0x000000;
			
			// let sizeShader = layer === "transit_point" ? vertLarge : vertPoint;

			base[type] = new THREE.ShaderMaterial({
				vertexShader: vertPoint,
				fragmentShader: fragPoint,
				uniforms: { color: { value: new THREE.Color(color) }, },
				transparent: true,
				depthWrite: false,
			})
		}
		return base;
	},

	getZoningColor: function (subtype) {
		return (
			subtype === "PUD" ? 0xdecc9b
			: subtype === "TOD" ? 0x734c00
			: subtype === "CH" ? 0xa03ca0
			: subtype === "CS" ? 0xa03c3c
			: subtype === "CS-1" ? 0xcd5c5c
			: subtype === "LI" ? 0xdf73ff
			: subtype === "IP" ? 0xdf73ff
			: subtype === "W/LO" ? 0xdf73ff
			: subtype === "DMU" ? 0x781e1e
			: subtype === "CBD" ? 0xc85aaa
			: subtype === "L" ? 0xffb4dc
			: subtype === "GR" ? 0xffb4dc
			: subtype === "CR" ? 0xffbebe
			: subtype === "LR" ? 0xff7f7f
			: subtype === "GO" ? 0xff7f7f
			: subtype === "LO" ? 0xff7f7f
			: subtype === "NO" ? 0xff7f7f
			: subtype === "MF-6" ? 0xb41e1e
			: subtype === "MF-5" ? 0xdc1e28
			: subtype === "MF-4" ? 0xf0287f
			: subtype === "MF-3" ? 0xff5078
			: subtype === "MF-2" ? 0xff7f7f
			: subtype === "MF-1" ? 0xff7f7f
			: subtype === "SF-6" ? 0xd2501e
			: subtype === "SF-5" ? 0xf0641e
			: subtype === "SF-4B" ? 0xff781e
			: subtype === "SF-4A" ? 0xff961e
			: subtype === "SF-3" ? 0xffd200
			: subtype === "SF-2" ? 0xfbed24
			: subtype === "SF-1" ? 0xf6eb73
			: subtype === "RR" ? 0xb4d79e
			: subtype === "LA" ? 0xffff9b
			: subtype === "UNZ" ? 0x686868
			: subtype === "P" ? 0xbed2ff
			: subtype === "NO-MU" ? 0xc455b1
			: subtype === "LO-MU" ? 0xc455b1
			: subtype === "GO-MU" ? 0xc455b1
			: subtype === "LR-MU" ? 0xc455b1
			: subtype === "CS-MU" ? 0xc41671
			: subtype === "GR-MU" ? 0xc41671
			: subtype === "CS-1-MU" ? 0xb41e1e
			: subtype === "CS/MF-6" ? 0xb41e1e
			: subtype === "CS-MU/MF-6" ? 0xb41e1e
			: subtype === "GR-MU/MF-6" ? 0xb41e1e
			: 0x000000
		);
	},

	// materials listed in order of rendering priority
	getGhost: function (mesh, subtypes) {
		let ghost = {};
		for (let i = 0; i < subtypes.length; i++) {
			let type = subtypes[i];
			ghost[type] = mesh === "Mesh" 
			? new THREE.MeshLambertMaterial({ 
				color: 0x52528c,
				side: THREE.DoubleSide 
				}) 
			: mesh === "Shape" 
			? new THREE.MeshLambertMaterial({ 
				color: 0x52528c,
				side: THREE.DoubleSide 
				}) 
			: mesh === "Path" 
			? new MeshLineMaterial({ 
				color: new THREE.Color(0x52528c),
				sizeAttenuation: 1,
				lineWidth: 15 
				})
			: mesh === "Point"
			? new THREE.ShaderMaterial({ // transit_point -> rail
				vertexShader: vertPoint,
				fragmentShader: fragPoint,
				uniforms: { 
					color: { value: new THREE.Color(darkgrey) }, // 0x52528c
				},
			})
			: new THREE.MeshLambertMaterial({ color: 0x000000 })
		}
		return ghost;
	},

	getSelect: function (mesh, subtypes) {
		let select = {};
		for (let i = 0; i < subtypes.length; i++) {
			let type = subtypes[i];
			select[type] = mesh === "Mesh" 
			? new THREE.MeshLambertMaterial({ 
				color: bluejay,
				side: THREE.DoubleSide 
				})
			: mesh === "Shape" 
			? new THREE.MeshLambertMaterial({ 
				color: bluejay,
				side: THREE.DoubleSide 
				})
			: mesh === "Path" 
			? new MeshLineMaterial({ 
				color: bluejay,
				sizeAttenuation: 1,
				lineWidth: 20
				})
			: mesh === "Point" && type === "address"
			? new THREE.ShaderMaterial({
				vertexShader: vertHover,
				fragmentShader: fragHover,
				uniforms: {
					"hl": { value: new THREE.Color(bluejay) },
					color: { value: new THREE.Color(grey) }	
				},
				side: THREE.BackSide,
				transparent: true,
				depthWrite: false,
			})
			: mesh === "Point" && type === "amenity"
			? new THREE.ShaderMaterial({
				vertexShader: vertHover,
				fragmentShader: fragHover,
				uniforms: {
					"hl": { value: new THREE.Color(bluejay) },
					color: { value: new THREE.Color(plum) }	
				},
				side: THREE.BackSide,
				transparent: true,
				depthWrite: false,
			})
			: mesh === "Point" && type === "infrastructure"
			? new THREE.ShaderMaterial({
				vertexShader: vertHover,
				fragmentShader: fragHover,
				uniforms: {
					"hl": { value: new THREE.Color(bluejay) },
					color: { value: new THREE.Color(cyber) }	
				},
				side: THREE.BackSide,
				transparent: true,
				depthWrite: false,
			})
			: mesh === "Point" && type === "natural"
			? new THREE.ShaderMaterial({
				vertexShader: vertHover,
				fragmentShader: fragHover,
				uniforms: {
					"hl": { value: new THREE.Color(bluejay) },
					color: { value: new THREE.Color(tree) }	
				},
				side: THREE.BackSide,
				transparent: true,
				depthWrite: false,
			})
			: new THREE.MeshLambertMaterial({ color: 0x000000 })
		}
		return select;
	},

	getHover: function (mesh, subtypes) {
		let hover = {};
		for (let i = 0; i < subtypes.length; i++) {
			let type = subtypes[i];
			hover[type] = 
			mesh === "Morph" 
			? new THREE.MeshLambertMaterial({ 
				color: baker, 
				transparent: true,
				opacity: 0.8,
			}) 
			: mesh === "Mesh" 
			? new THREE.MeshLambertMaterial({ 
				color: baker, 
				transparent: true,
				opacity: 0.8,
			}) 
			: mesh === "Shape" 
			? new THREE.MeshLambertMaterial({
				color: baker, 
				side: THREE.BackSide,
				transparent: true,
				opacity: 0.8
			})
			: mesh === "Path" 
			? new MeshLineMaterial({ 
				color: baker,
				sizeAttenuation: 1,
				lineWidth: 20 // 15
			})
			: mesh === "Point" && type === "address"
			? new THREE.ShaderMaterial({
				vertexShader: vertHover,
				fragmentShader: fragHover,
				uniforms: {
					"hl": { value: new THREE.Color(baker) },
					color: { value: new THREE.Color(grey) }	
				},
				side: THREE.BackSide,
				transparent: true,
				depthWrite: false,
			})
			: mesh === "Point" && type === "amenity"
			? new THREE.ShaderMaterial({
				vertexShader: vertHover,
				fragmentShader: fragHover,
				uniforms: {
					"hl": { value: new THREE.Color(baker) },
					color: { value: new THREE.Color(plum) }		
				},
				side: THREE.BackSide,
				transparent: true,
				depthWrite: false,
			})
			: mesh === "Point" && type === "infrastructure"
			? new THREE.ShaderMaterial({
				vertexShader: vertHover,
				fragmentShader: fragHover,
				uniforms: {
					"hl": { value: new THREE.Color(baker) },
					color: { value: new THREE.Color(cyber) }		
				},
				side: THREE.BackSide,
				transparent: true,
				depthWrite: false,
			})
			: mesh === "Point" && type === "natural"
			? new THREE.ShaderMaterial({
				vertexShader: vertHover,
				fragmentShader: fragHover,
				uniforms: {
					"hl": { value: new THREE.Color(baker) },
					color: { value: new THREE.Color(tree) } //628b48
				},
				side: THREE.BackSide,
				transparent: true,
				depthWrite: false,
			})
			: mesh === "Point" && type === "bus"
			? new THREE.ShaderMaterial({
				vertexShader: vertHover,
				fragmentShader: fragHover,
				uniforms: {
					"hl": { value: new THREE.Color(baker) },
					color: { value: new THREE.Color(orange) } //628b48
				},
				side: THREE.BackSide,
				transparent: true,
				depthWrite: false,
			})
			: mesh === "Point" && type === "bicycle"
			? new THREE.ShaderMaterial({
				vertexShader: vertHover,
				fragmentShader: fragHover,
				uniforms: {
					"hl": { value: new THREE.Color(baker) },
					color: { value: new THREE.Color(orange) }
				},
				side: THREE.BackSide,
				transparent: true,
				depthWrite: false,
			})
			: mesh === "Point" && type === "parking"
			? new THREE.ShaderMaterial({
				vertexShader: vertHover,
				fragmentShader: fragHover,
				uniforms: {
					"hl": { value: new THREE.Color(baker) },
					color: { value: new THREE.Color(garage) }
				},
				side: THREE.BackSide,
				transparent: true,
				depthWrite: false,
			})
			: new THREE.MeshLambertMaterial({ color: 0x000000 })
		}
		return hover;
	},

	getSearch: function (mesh) {
		return (
			mesh === "Mesh"
			? new THREE.MeshLambertMaterial({ 
				color: baker, 
				side: THREE.DoubleSide 
				})
			: mesh === "Shape"
			? new THREE.MeshLambertMaterial({ 
				color: azul,
				side: THREE.DoubleSide 
				})
			: mesh === "Path" 
			? new MeshLineMaterial({ 
				color: new THREE.Color(azul),
				sizeAttenuation: 1,
				lineWidth: 15 
				}) 
			: mesh === "Point"
			? new THREE.PointsMaterial( { 
				size: 5, 
				sizeAttenuation: false, 
				color: azul
				})
			: new THREE.MeshLambertMaterial({ color: 0x000000 })
		);
	},

	getEdge: function (layer) {
		let color = 
			layer === "building" ? bluejay
			: layer === "hexagon" ? 0xffffff
			: layer === "parking" ? 0x000000
			: layer === "locale" ? 0x86cd82
			: layer === "parcel" ? 0x000000
			: layer === "zoning" ? 0x000000
			: 0x000000;

		return new THREE.LineBasicMaterial({ color: color });
	},

	getGPU: function (key) {
		let hex = parseInt(key, 16); 
		return (
			key[0] === "c"
			? new THREE.MeshBasicMaterial({
				color: new THREE.Color(hex),
				morphTargets: true 
			})
			: new THREE.ShaderMaterial({
				uniforms: { color: { value: new THREE.Color(hex), } },
				vertexShader: vertPicker,
				fragmentShader: fragPicker,
				transparent: false,
				side: THREE.DoubleSide,
			})
		);
	},

	getVertColors: function (geometry, hex, alt) { // alt optional
		const posObj = geometry.getAttribute("position");
		let vertColors = [];
		let yCoords = posObj.array.filter((num, i) => (i-1) % 3 === 0);
		let althex = alt || hex;
		let color = new THREE.Color();
		for (let i = 0; i < posObj.count; i++) {
			if (yCoords[i] === 0) {
				color.set(althex);
				Array.prototype.push.apply(vertColors, color.toArray());
			}else{
				color.set(hex);
				Array.prototype.push.apply(vertColors, color.toArray());
			}
		}
		return new THREE.Float32BufferAttribute(vertColors, 3);
	}
}

// for GPUPicker
const vertPicker = `
	void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;

const fragPicker = `
	uniform vec3 color;
	void main(void) { gl_FragColor = vec4(color,1.0); }
`;

// normal points
const vertPoint = `
	attribute float size; 
	
	void main() {   
		vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
		gl_Position = projectionMatrix * mvPosition;
		gl_PointSize = size * ( 320.0 / -mvPosition.z );
	}
`;
const fragPoint = `
	precision mediump float;
	uniform vec3 color;

	void main() {	
		float r = 0.0, delta = 0.0, alpha = 1.0;
		vec2 cxy = 2.0 * gl_PointCoord - 1.0;
		r = dot(cxy, cxy);
		delta = fwidth(r);
		alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);
		gl_FragColor = vec4(color, alpha);
	}
`;

// for mouse hover over point
const vertHover = `
	attribute float size;
	
	void main() {
		vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
		gl_Position = projectionMatrix * mvPosition;
		gl_PointSize = size * ( 500.0 / -mvPosition.z );
	}
`;

const fragHover = `
	precision mediump float;
	uniform vec3 color;
	uniform vec3 hl;

	void main() {
		vec3 vColor;
		float ir = color.r, ig = color.g, ib = color.b;
		float vr = hl.r, vg = hl.g, vb = hl.b;
		float dr = ir-vr, dg = ig-vg, db = ib-vb;
		float r = 0.0, delta = 0.0, alpha = 1.0;
		vec2 cxy = 2.0 * gl_PointCoord - 1.0;
		r = dot(cxy, cxy);

		// ir = og color
		// vr = hl color
		// dr difference between colors

		delta = fwidth(r); // ranges btwn 0 -> 0.025
		alpha = 1.0 - smoothstep(1.0 - delta, 1.0 + delta, r);
		vColor.r = ir - (smoothstep(0.75 - delta, 0.75 + delta, r) * dr);
		vColor.g = ig - (smoothstep(0.75 - delta, 0.75 + delta, r) * dg);
		vColor.b = ib - (smoothstep(0.75 - delta, 0.75 + delta, r) * db);

		gl_FragColor = vec4(vColor, alpha);
	}
`;

const lambovt = `
	#define LAMBERT
	varying vec3 vLightFront;
	varying vec3 vIndirectFront;
	#ifdef DOUBLE_SIDED
		varying vec3 vLightBack;
		varying vec3 vIndirectBack;
	#endif
	#include <common>
	#include <uv_pars_vertex>
	#include <uv2_pars_vertex>
	#include <envmap_pars_vertex>
	#include <bsdfs>
	#include <lights_pars_begin>

		// #include <color_pars_vertex>
		varying vec3 vColor;
		attribute vec3 morphColor0;
		attribute vec3 morphColor1;
		// attribute float opacity;
		// varying float op;
		
	#include <fog_pars_vertex>
	#include <morphtarget_pars_vertex>
	#include <skinning_pars_vertex>
	#include <shadowmap_pars_vertex>
	#include <logdepthbuf_pars_vertex>
	#include <clipping_planes_pars_vertex>

	void main() {
		#include <uv_vertex>
		#include <uv2_vertex>
		// #include <color_vertex>

		vColor.xyz = color * (1.0-morphTargetInfluences[0]) * (1.0-morphTargetInfluences[1]);
		vColor += morphColor0 * morphTargetInfluences[0];
		vColor += morphColor1 * morphTargetInfluences[1];
		// op = opacity;

		#include <beginnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
		#include <begin_vertex>

		// #include <morphtarget_vertex>
		transformed += (morphTarget0 - position) * morphTargetInfluences[0];
		transformed += (morphTarget1 - position) * morphTargetInfluences[1];
		
		#include <skinning_vertex>
		#include <project_vertex>
		#include <logdepthbuf_vertex>
		#include <clipping_planes_vertex>
		#include <worldpos_vertex>
		#include <envmap_vertex>
		#include <lights_lambert_vertex>
		#include <shadowmap_vertex>
		#include <fog_vertex>
}`;
/*
const lambofrag = `
	uniform vec3 diffuse;
	uniform vec3 emissive;
	// uniform float opacity;
	varying float op;

	varying vec3 vLightFront;
	varying vec3 vIndirectFront;
	#ifdef DOUBLE_SIDED
		varying vec3 vLightBack;
		varying vec3 vIndirectBack;
	#endif
	#include <common>
	#include <packing>
	#include <dithering_pars_fragment>
	#include <color_pars_fragment>
	#include <uv_pars_fragment>
	#include <uv2_pars_fragment>
	#include <map_pars_fragment>
	#include <alphamap_pars_fragment>
	#include <aomap_pars_fragment>
	#include <lightmap_pars_fragment>
	#include <emissivemap_pars_fragment>
	#include <envmap_common_pars_fragment>
	#include <envmap_pars_fragment>
	#include <cube_uv_reflection_fragment>
	#include <bsdfs>
	#include <lights_pars_begin>
	#include <fog_pars_fragment>
	#include <shadowmap_pars_fragment>
	#include <shadowmask_pars_fragment>
	#include <specularmap_pars_fragment>
	#include <logdepthbuf_pars_fragment>
	#include <clipping_planes_pars_fragment>
	void main() {
		#include <clipping_planes_fragment>
		vec4 diffuseColor = vec4( diffuse, op );
		ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
		vec3 totalEmissiveRadiance = emissive;
		#include <logdepthbuf_fragment>
		#include <map_fragment>
		#include <color_fragment>
		#include <alphamap_fragment>
		#include <alphatest_fragment>
		#include <specularmap_fragment>
		#include <emissivemap_fragment>
		#ifdef DOUBLE_SIDED
			reflectedLight.indirectDiffuse += ( gl_FrontFacing ) ? vIndirectFront : vIndirectBack;
		#else
			reflectedLight.indirectDiffuse += vIndirectFront;
		#endif
		#include <lightmap_fragment>
		reflectedLight.indirectDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb );
		#ifdef DOUBLE_SIDED
			reflectedLight.directDiffuse = ( gl_FrontFacing ) ? vLightFront : vLightBack;
		#else
			reflectedLight.directDiffuse = vLightFront;
		#endif
		reflectedLight.directDiffuse *= BRDF_Diffuse_Lambert( diffuseColor.rgb ) * getShadowMask();
		#include <aomap_fragment>
		vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
		#include <envmap_fragment>
		gl_FragColor = vec4( outgoingLight, diffuseColor.a );
		//gl_FragColor = vec4( outgoingLight, 0.5 );
		#include <tonemapping_fragment>
		#include <encodings_fragment>
		#include <fog_fragment>
		#include <premultiplied_alpha_fragment>
		#include <dithering_fragment>
	}
`;
	// MONOCENTRIC //

    red-shade: #cd616a;
    red-light: #f17672;
    fusch-shade: #d27c9d;
    fusch-light: #f394ab;
    pink-shade: #cd9ec4;
    pink-light: #f6bcd5;
    pale-shade: #c8bbd7;
    pale-light: #f2dfed;

	// ADAPTIVE COLOR SCHEME // 
	grey/backdrop: #f7f7f7
	greenish grey: #eaf2e3
	peach: #eacbd2

	pink: #fe90ad; Baker-Miller
	yellow: #ffd639; Cyber-Yellow
	blue-lite: #5aa9e6 Blue Jeans
	red: #bf211e;
	orange: ff8d39;
	orange: ff4e00; International Orange
	
	teal: #16bac5;
	blue-baby: #5aa9e67;
	blue-powder: #7d82b8;
	navy: #28536b;
	navy-light: #33658a;
	purple-coolors: #9b5de5;
	purple-bright: #b55ae6;
	plum: #9c89b8;
	plum-navy: #52528c;

	GREYS
	0xebebeb
	0xe1e1e1
	0xd7d7d7
	0xcccccc
	0xc2c2c2
	0xb7b7b7
	0xacacac
	0xa1a1a1
	0x959595
*/

export default mat;

