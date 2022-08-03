import * as TWEEN from "es6-tween";

class Morph extends Component {

    test = () => {
        console.log("blergens");
    }

    // renders monocentric model
    renderMonocentric = (active, eq, mode, param) => {
        if (active) {
            if (eq === "density") this.monoDensity(mode, param);
            if (eq === "land value") this.monoLandValue(mode);
            if (eq === "transit") this.monoTransit(mode);
            }else{
            // this.revertGradient();
            this.isolate("hex", "street", "block", "building");
            const { mast, frontier, curve, buttress } = this.environment.mono;
            mast.visible = frontier.visible = curve.mesh.visible = buttress.visible = false;
        }
    }

    monoDensity = (mode, param) => {
        if (mode === "existing") { 
        this.isolate("hex", "street", "block", "graph");
        this.morphGraph(param);
        }
        if (mode === "expected") {
        this.isolate("hex", "street", "block", "graph");
        this.morphGraph(mode);
        }

        /*
        if (mode === "distortion") {
        this.isolate("hex", "street", "block", "building", "parking");
        const { v0, vx, g, x } = this.state.density;
        const { mast, frontier, curve, buttress } = this.environment.mono;
        const newVectors = monocentric.genCurve(v0, vx, g, x);
        mast.visible = frontier.visible = curve.mesh.visible = buttress.visible = true;

        this.morphSpline(curve, buttress, newVectors);
        this.morphY(frontier, vx);
        this.morphY(mast, v0);
        this.moveFrontier(frontier, x, 0);
        
        //const delay = t => new Promise(resolve => setTimeout(resolve, t));
        //delay(750).then(() => this.renderGradient(v0, g));
        }else{
        //this.revertGradient();
        const { mast, frontier, curve, buttress } = this.environment.mono;
        mast.visible = frontier.visible = curve.mesh.visible = buttress.visible = false;
        }
        */
    }

    monoLandValue = (mode) => {
        this.isolate("hex", "street", "zoning", "block", "capacity");
        const { mast, frontier, curve, buttress } = this.environment.mono;
        mast.visible = frontier.visible = curve.mesh.visible = buttress.visible = false;
    }

    monoTransit = (mode) => {
        // isolate hex, block, street
        // color blocks by proximity to transit
    }

    // MORPH FUNCTIONS
    morphGraph = (morph) => {
        const env = this.environment["c"];
        const graphMesh = env.active.mesh.population;
        const gpuMesh = env.active.gpu.population;
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

}

export default Morph