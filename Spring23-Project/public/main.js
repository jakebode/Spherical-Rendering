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

// console.log(vertexData);
const texCoords = icosahedron.getTexCoords();
// console.log(texCoords);
myCanvas.bindBuffers(vertexData, colorData, texCoords);

////////////////////////////////////////////
// shader code below

    // var vertexSource = `
    //     precision highp float;
    //     attribute vec3 position;
    //     attribute vec2 texture;
    //     varying vec2 texCoord;
    //     uniform mat4 matrix;
    //     void main() {
    //         gl_Position = matrix * vec4(position, 1);
    //         texCoord = texture;
    //     }
    // `;

    // var fragmentSource = `
    //     precision highp float;
    //     // passed from vertexSource
    //     varying vec2 texCoord;
    //     // The texture
    //     uniform sampler2D texture;
    //     void main() {
    //         gl_FragColor = texture2D(texture, texCoord);
    //     }
    // `;

    var vertexSource = `
precision highp float;
attribute vec3 position;
attribute vec3 color;
attribute vec2 texture;

varying vec3 vColor;
varying vec2 vTexture;
uniform mat4 matrix;
vec4 a;
vec3 temp;
void main() {
    a = matrix * vec4(color, 1.0);
    //vColor = vec3(1.0, 2.0, 3.0);
    vTexture = texture;
    vColor = a.xyz;
    gl_Position = matrix * vec4(position, 1);
}
`;

var fragmentSource = `
precision highp float;
varying vec3 vColor;
varying vec2 vTexture;

uniform sampler2D texture;

float a;
void main() {
    
    //if (vColor.z > 0.0) {
    //    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    //} else {
    //    gl_FragColor = vec4(0.0,0.0,1.0,1.0);
    //}
    
    
    a = 0.8 * clamp(dot(normalize(vColor), vec3(0.0, 0.0, -1.0)), 0.0, 1.0);
    //gl_FragColor = vec4(a + 0.2, a*vTexture.x + 0.2, a*vTexture.y + 0.2, 1.0);
    gl_FragColor = texture2D(texture, vTexture);
}
`;

//
// End of shader code
///////////////////////////////////////////////////////////////////////////

myCanvas.createShaders(vertexSource, fragmentSource);
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

function animate() {
    requestAnimationFrame(animate);
    //mat4.rotateY(matrix, matrix, Math.PI/2 / 100);
    //mat4.rotateX(matrix, matrix, Math.PI/2 / 200);
    mat4.rotateZ(matrix, matrix, Math.PI/2 / 300);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    // gl.cullFace(gl.BACK);
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0, 0.5, 0, 1);

    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}

animate();
