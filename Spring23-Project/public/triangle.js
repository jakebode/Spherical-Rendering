import { Canvas } from './modules/canvas.js';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

if (!gl) {
    throw new Error('WebGL not supported');
}

// use of my terrible canvas object to simplify main.js
const myCanvas = new Canvas(gl);

var vertexData = [-1, -1, 0, 1, 1, 0, 1, -1, 0];

var colorData = [1, 0, 0, 1, 0, 0, 1, 0, 0];

var texCoords = [0, 0, 0, 1, 1, 1];


myCanvas.bindBuffers(vertexData, colorData, texCoords);


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

myCanvas.createShaders(vertexSource, fragmentSource);
myCanvas.initProgram();
myCanvas.linkAttributes();

const uniformLocations = {
    matrix: gl.getUniformLocation(myCanvas.program, 'matrix'),
};

const matrix = mat4.create();

mat4.translate(matrix, matrix, [0, 0, 0]);
mat4.scale(matrix, matrix, [1, 1, 1]);

function animate() {
    requestAnimationFrame(animate);
    //mat4.rotateY(matrix, matrix, Math.PI/2 / 100);
    //mat4.rotateX(matrix, matrix, Math.PI/2 / 200);
    //mat4.rotateZ(matrix, matrix, Math.PI/2 / 300);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
    gl.clearColor(0, 0.5, 0, 1);

    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}

animate();
