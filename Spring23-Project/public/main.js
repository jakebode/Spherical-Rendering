/*
*   Author: Jake Bode
*   Main js file to create canvas and do scripts for webpage
*/

// 1) spherical coordinates to map textures onto sphere
// 2) next compute normals to configure shading/coloring
//  - normal to sphere, then normal to polyhedron
//  - assign random colors to vertices
// 3) generate random fields, height fields on 'planet'


// how to map textures onto sphere
// learn to create texture

import { Canvas } from './modules/canvas.js';
import { Icosahedron } from './modules/icosahedron.js';

///////////////////////////////////////////////////////////
// Initializing of WebGL context in web canvas
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

// use of my terrible canvas object to simplify main.js
const myCanvas = new Canvas(gl);

// slightly better use of JS classees under a future inheritance hierarchy
const icosahedron = new Icosahedron();
icosahedron.subdivideEdges();
icosahedron.subdivideEdges();
icosahedron.subdivideEdges();
const vertexData = icosahedron.vertexData;
const colorData = icosahedron.getNormals();

myCanvas.bindBuffers(vertexData, colorData);

//////////////////////////////////////////////////////////////////////////
// Begin shader language code to compile and bind to program
//

// need better way to implement shader code into program
var vertexSource = `
precision mediump float;
attribute vec3 position;
attribute vec3 color;
//attribute vec3 aVertexNormal;
varying vec3 vColor;
uniform mat4 matrix;
vec4 a;
vec3 temp;
void main() {
    a = matrix * vec4(color, 1.0);
    //vColor = vec3(1.0, 2.0, 3.0);
    vColor = a.xyz;
    gl_Position = matrix * vec4(position, 1);
}
`;

var fragmentSource = `
precision highp float;
varying vec3 vColor;
float a;
void main() {
    
    //if (vColor.z > 0.0) {
    //    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    //} else {
    //    gl_FragColor = vec4(0.0,0.0,1.0,1.0);
    //}
    
    
    a = 0.8 * clamp(dot(normalize(vColor), vec3(0.0, 0.0, -1.0)), 0.0, 1.0);
    gl_FragColor = vec4(a + 0.2, a + 0.2, a + 0.2, 1.0);
}
`;

////////////////////////////////////////////
// shader code below used for testing

var newVShader = `
precision highp float;
attribute vec3 position;
attribute vec3 color;
//attribute vec3 aVertexNormal;
varying vec3 vColor;
varying vec3 coord;
uniform mat4 matrix;
vec4 a;
vec3 temp;
void main() {
    coord = position;
    a = matrix * vec4(color, 1.0);
    //vColor = vec3(1.0, 2.0, 3.0);
    vColor = a.xyz;
    gl_Position = matrix * vec4(position, 1);
}
`;

var newFShader = `
precision highp float;
varying vec3 vColor;
varying vec3 coord;
float a;
void main() {
    a = 0.8 * clamp(dot(normalize(vColor), normalize(vec3(-5.0, -5.0, -5.0)-coord)), 0.0, 1.0);
    gl_FragColor = vec4(a + 0.2, a + 0.2, a + 0.2, 1.0);
}
`;

//
// End of shader code
///////////////////////////////////////////////////////////////////////////

myCanvas.createShaders(newVShader, newFShader);
myCanvas.initProgram();
myCanvas.linkAttributes();


// WORK IN PROGRESS:
//      need to implement proper method in Canvas class to animate

//myCanvas.animate(icosahedron.vertexData, false, true, false);

const uniformLocations = {
    matrix: gl.getUniformLocation(myCanvas.program, 'matrix'),
};

const matrix = mat4.create();

mat4.translate(matrix, matrix, [0, 0, 0]);
mat4.scale(matrix, matrix, [0.5, 0.5, 0.5]);

console.log(matrix);

function animate() {
    requestAnimationFrame(animate);
    //mat4.rotateY(matrix, matrix, Math.PI/2 / 70);
    //mat4.rotateX(matrix, matrix, Math.PI/2 / 70);
    //mat4.rotateZ(matrix, matrix, Math.PI/2 / 70);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    // gl.cullFace(gl.BACK);
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0, 0.5, 0, 1);

    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}

animate();
