//
// MONOCENTRIC MODEL
//

import * as THREE from "three";
import { MeshLine } from 'three.meshline';
import util from "../util/Util.js";
import mat from "../util/Materials.js";
import convert from "../util/Convert.js";

const e = 2.71828;

const monocentric = {

	scope: function (center, xKm) {
		const xFt = convert.kmToFt(xKm);
		const scopemat = mat.monocentric("scope");
		let geometry = new THREE.CircleBufferGeometry( 1000, 64 );
			geometry.rotateX( Math.PI / 2 );
			geometry.translate(0, -22, 0);
		let circle = new THREE.Mesh( geometry, scopemat );
			circle.scale.x = xFt/1000;
			circle.scale.z = xFt/1000;
		return circle;
	},

	mast: function (center, v0) { //avgDensity is for scaling
		const mastmat = mat.monocentric("frame");
		let geometry = new THREE.Geometry();
			geometry.vertices.push(util.vertex3D( center, 0 ));
			geometry.vertices.push(util.vertex3D( center, 1000 ));
		
		let g = new MeshLine();
			g.setGeometry( geometry );
		let mast = new THREE.Mesh(g.geometry, mastmat);
			mast.scale.y = v0/1000;
			mast.visible = false;
		
		return mast;
	},

	frontier: function (vx, xKm) {
		const xFt = convert.kmToFt(xKm);
		const edgemat =  mat.monocentric("frame");
		let geometry = new THREE.Geometry();		
			geometry.vertices.push(util.vertex3D( [0, 0], 0 ));
			geometry.vertices.push(util.vertex3D( [0, 0], 1000 ));
		
		let g = new MeshLine();
			g.setGeometry( geometry );
		let edge = new THREE.Mesh(g.geometry, edgemat);
			edge.scale.y = vx/1000;
			edge.visible = false;

		let pos = this.rVector(xFt, 0);
		edge.position.set(pos.x, pos.y, pos.z);
		
		return edge;
	},

	curve: function (vectors) { 
		let curvemat =  mat.monocentric("frame");
		let curve = new THREE.CatmullRomCurve3( vectors );
		let points = curve.getPoints( 15 );
		let geometry = new THREE.BufferGeometry().setFromPoints( points );
		curve.mesh = new THREE.Line( geometry.clone(), curvemat );
		curve.mesh.curveType = "centripetal";
		curve.mesh.castShadow = true;
		curve.mesh.visible = false;

		return curve;
	},

	buttress: function (vector3s) {
		let buttgeo = new THREE.Geometry();
		let curve = new THREE.CatmullRomCurve3( vector3s );
		let vectors = curve.getPoints( 15 );
		let mast = vectors[0].clone();
		let frontier = vectors[vectors.length-1].clone();

		buttgeo.vertices.push(mast.setY(0));
		buttgeo.vertices.push(frontier.setY(0));

		for (let i = vectors.length-1; i >= 0; --i) {
			buttgeo.vertices.push(vectors[i]);
		}

		buttgeo.faces.push( new THREE.Face3( 0, 1, 2 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 2, 3 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 3, 4 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 4, 5 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 5, 6 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 6, 7 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 7, 8 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 8, 9 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 9, 10 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 10, 11 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 11, 12 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 12, 13 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 13, 14 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 14, 15 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 15, 16 ) );
		buttgeo.faces.push( new THREE.Face3( 0, 16, 17 ) );
		buttgeo.computeBoundingSphere();
		
		let buffer = new THREE.BufferGeometry().fromGeometry(buttgeo);
		buffer.morphAttributes.position = []; // prepare for morph

		return buffer;
	},

	rVector: function (r, theta) {
		return new THREE.Vector3( r * Math.cos(theta), 0, r * Math.sin(theta) );
	},

	rCoord: function (r, theta) {
		let x = r*Math.cos(theta);
		let z = r*Math.sin(theta);
		return [x, z];
	},

	genCurve: function (v0, vx, g, x) {
		let theta = 0;
		let x1 = x/3;
		let x2 = x*2/3;

		let vx1 = this.calcMain( v0, g, x1 );
		let vx2 = this.calcMain( v0, g, x2 );
		let vx3 = this.calcMain( v0, g, x );

		let mx1 = convert.kmToFt(x1);
		let mx2 = convert.kmToFt(x2);
		let mx3 = convert.kmToFt(x);

		let pos0 = (util.vertex3D( [0,0], v0 ))
		let pos1 = (util.vertex3D( this.rCoord(mx1, theta), vx1 ));
		let pos2 = (util.vertex3D( this.rCoord(mx2, theta), vx2 ));
		let pos3 = (util.vertex3D( this.rCoord(mx3, theta), vx3 ));

		let vectors = [pos0, pos1, pos2, pos3];
		
		return vectors;
	},
	
	calcMain: function (v0, gradient, xkm) { // v(x) = v0 e -cx
		let ng = -Math.abs(gradient);
        let exp = ng*xkm;
        let egx = Math.pow(e, exp);
        let vx = v0*egx;

        return vx;
	},

	calcZero: function (vx, gradient, xkm) { // v0 = v(x) / e -cx
		let ng = -Math.abs(gradient);
        let exp = ng*xkm;
        let egx = Math.pow(e, exp);
        let v0 = vx/egx;
        return v0;
	},

    modelDensity: function (d0, gval, dtCBD, dtTransit) {
        let km = convert.ftToKm(dtCBD);
        let g = -Math.abs(gval);
        let exp = g*km;
        let egx = Math.pow(e, exp);
        let dx = d0*egx;
      
        //if (dtTransit<300) { dx = dx*2.5; }

        return dx;
    },
    
    distortion: function (real, model) {
		if (real === 0) console.log("zero");
		const d = real/model;
		return (
			d === 0 ? "-5"
			: d < 0.05 ? "-4"
			: d < 0.1 ? "-3"
			: d < 0.25 ? "-2"
			: d < 0.75 ? "-1"
			: d >= 0.75 && d <= 1.25 ? "0" 
			: d < 3 ? "1"
			: d < 4 ? "2"
			: d < 6 ? "3"
			: d < 8 ? "4"
			: d < 20 ? "5"
			: null //console.log(real + " error distortion");
		);
	},

	/*
	"-5": new THREE.Color( 0xad2326 ),
	"-4": new THREE.Color( 0xf06b6d ),
	"-3": new THREE.Color( 0xf28dac ),
	"-2": new THREE.Color( 0xf1b9d4 ),
	"-1": new THREE.Color( 0xf0deed ),
	"0": new THREE.Color( 0xffffff ),
	"1": new THREE.Color( 0xdceee8 ),
	"2": new THREE.Color( 0xadd8e0 ),
	"3": new THREE.Color( 0x81afd3 ),
	"4": new THREE.Color( 0x516ba2 ),
	"5": new THREE.Color( 0x213c75 ),
	*/

    getGradient: function () {
		// new THREE.Color(baker)
		return {
			"-5": new THREE.Color( purple ),
			"-4": new THREE.Color( blue ),
			"-3": new THREE.Color( plum ),
			"-2": new THREE.Color( jasmine ),
			"-1": new THREE.Color( baby ),
			"0": new THREE.Color( baby ),
			"1": new THREE.Color( light ),
			"2": new THREE.Color( light ),
			"3": new THREE.Color( peach ),
			"4": new THREE.Color( orange ),
			"5": new THREE.Color( red ),
		}
    }
}

const red = 0xdf5004;
const orange = 0xff9431;
const peach = 0xffd1a1;
const purple = 0x6a51a4;
const plum = 0xa29fcc;
const jasmine = 0xdcdbeb;
const blue = 0x2979b8;
const baby = 0x72b1dc;
const light = 0xc7dcef;

export default monocentric;

