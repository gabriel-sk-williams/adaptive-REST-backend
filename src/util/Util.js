import * as THREE from "three";
import mat from "./Materials.js";

//
// UTILITY FUNCTIONS FOR USE BY MODELER
//

const util = {

	loadBuffer: function (mesh, data) {
		return (
			mesh === "Morph"
			? this.loadBufferMorph(data)
			: mesh === "Mesh"
			? this.loadBufferMesh(data)
			: mesh === "Shape"
			? this.loadBufferShape(data)
			: this.loadBufferPath(data)
		);
	},

	loadHover: function (mesh, data, influences) {
		return (
			mesh === "Morph"
			? this.loadHoverMorph(data, influences)
			: mesh === "Mesh"
			? this.loadBufferMesh(data)
			: mesh === "Shape"
			? this.loadHoverShape(data)
			: mesh === "Path"
			? this.loadBufferPath(data)
			: this.loadBufferPoint(data)
		);
	},

	loadHoverMorph: function (bufferData, influences) {
		let [ resM, offM, expM ] = influences;
		let morphGeo = new THREE.BufferGeometry();
		let positions = !resM && !offM && !expM
			? new Float32Array(bufferData.position)
			: resM
			? new Float32Array(bufferData.resPos)
			: offM
			? new Float32Array(bufferData.offPos)
			: expM
			? new Float32Array(bufferData.exPos)
			: new Float32Array(bufferData.position);
		let normals = new Float32Array(bufferData.normal);

		morphGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3)); 
		morphGeo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));

		return morphGeo;
	},

	loadHoverShape: function (bufferData) {
		let bufferShape = new THREE.BufferGeometry();
		let indices = bufferData.index;
		let positions = new Float32Array(bufferData.position);
		let normals = new Float32Array(bufferData.normal);
		
		bufferShape.setIndex(indices)
		bufferShape.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
		bufferShape.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));  
		return bufferShape;
	},

	loadBufferMorph: function (bufferData) {
		let morphGeo = new THREE.BufferGeometry();
		let positions = new Float32Array(bufferData.position);
		let normals = new Float32Array(bufferData.normal);
		let resPos = new Float32Array(bufferData.resPos);
		let offPos = new Float32Array(bufferData.offPos);
		let exPos = new Float32Array(bufferData.exPos);

		morphGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		morphGeo.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
		morphGeo.morphAttributes.position = []; // prepare for morph
		morphGeo.morphAttributes.position[ 0 ] = new THREE.BufferAttribute(resPos, 3);
		morphGeo.morphAttributes.position[ 1 ] = new THREE.BufferAttribute(offPos, 3);
		morphGeo.morphAttributes.position[ 2 ] = new THREE.BufferAttribute(exPos, 3);

		return morphGeo;
	},

	loadBufferMesh: function (bufferData) {
		let bufferGeometry = new THREE.BufferGeometry();
		let positions = new Float32Array(bufferData.position);
		let normals = new Float32Array(bufferData.normal); 
		bufferGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		bufferGeometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));    
		return bufferGeometry;
	},

	// let indices = bufferData.index.map(obj => obj.low) // {low: int, high: 0} from neo4j
	loadBufferShape: function (bufferData) {

		let bufferShape = new THREE.BufferGeometry();
		let indices = bufferData.index;
		let positions = new Float32Array(bufferData.position);
		let normals = new Float32Array(bufferData.normal);
		
		bufferShape.setIndex(indices)
		bufferShape.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
		bufferShape.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));

		return bufferShape;
	},

	loadBufferPath: function (bufferData) {
		let bufferPath = new THREE.BufferGeometry();
		let indices = bufferData.index;

		let counters = new Float32Array(bufferData.count);
		let next = new Float32Array(bufferData.next);
		let positions = new Float32Array(bufferData.position);
		let previous = new Float32Array(bufferData.previous);
		let sides = new Float32Array(bufferData.side);
		let width = new Float32Array(bufferData.width);
		//let sides = new Float32Array(bufferData.side.map(obj => obj.low));
		//let width = new Float32Array(bufferData.width.map(obj => obj.low));
			
		bufferPath.setIndex(indices)
		bufferPath.setAttribute("counters", new THREE.BufferAttribute(counters, 1));
		bufferPath.setAttribute("next", new THREE.BufferAttribute(next, 3));
		bufferPath.setAttribute("position", new THREE.BufferAttribute(positions, 3));
		bufferPath.setAttribute("previous", new THREE.BufferAttribute(previous, 3));
		bufferPath.setAttribute("side", new THREE.BufferAttribute(sides, 1));
		bufferPath.setAttribute("width", new THREE.BufferAttribute(width, 1));
		return bufferPath;
	},

	loadBufferPoint: function (datum) {
		let bufferPoint = new THREE.BufferGeometry();
		let position = new Float32Array(datum);
		const PARTICLE_SIZE = new Float32Array([100]);

		bufferPoint.setAttribute("position", new THREE.BufferAttribute(position, 3));
		bufferPoint.setAttribute("size", new THREE.BufferAttribute(PARTICLE_SIZE, 1));
		return bufferPoint;
	},
	
	/*
	loadBufferPoint: function (bufferData) {
		let bufferPoint = new THREE.BufferGeometry();
		let position = new Float32Array(bufferData.position);
		const PARTICLE_SIZE = new Float32Array([100]);

		bufferPoint.setAttribute("position", new THREE.BufferAttribute(position, 3));
		bufferPoint.setAttribute("size", new THREE.BufferAttribute(PARTICLE_SIZE, 1));
		return bufferPoint;
	},
	*/

	// let indices = bufferData.tubeind.map(obj => obj.low);
	loadBufferTube: function (bufferData) {
		let indices = bufferData.tubeind;
		let position = new Float32Array(bufferData.tubepos);
		let normal = new Float32Array(bufferData.tubenorm);
		let bufferTube = new THREE.BufferGeometry();

		bufferTube.setIndex(indices)
		bufferTube.setAttribute("position", new THREE.BufferAttribute(position, 3));
		bufferTube.setAttribute("normal", new THREE.BufferAttribute(normal, 3));
		return bufferTube;
	},

	loadBufferSphere: function (bufferData, size, subd) {
		let pos = bufferData.position;
		let bufferSphere = new THREE.SphereBufferGeometry( size, subd, subd);
		bufferSphere.translate(pos[0], pos[1], pos[2]);

		return bufferSphere;
	},

	boundary: function (center, radius) {
		const scopemat = mat.getScene("scope");
		const r = radius*5280;
		const geometry = new THREE.CircleBufferGeometry(1000, 64);
		geometry.rotateX(Math.PI / 2);
		geometry.translate(center[0], -50, center[1]); //-52
		const circle = new THREE.Mesh(geometry, scopemat);
		circle.scale.x = r/1000;
		circle.scale.z = r/1000;
		// visible
		return circle;
	},

	// still used by monocentric
	vertex2D: function ([lon, lat]) { return new THREE.Vector2(lon, -lat); },
	vertex3D: function ([lon, lat], z) { return new THREE.Vector3(lon, z, -lat); },
  	addCommas: function (x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); },

	// makes ids in for duplicate React Components (layoutModel.js)
	makeId: function (integer) { 
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (var i = 0; i < integer; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	},
}

export default util;

