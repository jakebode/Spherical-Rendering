/*
*   Author: Jake Bode
*   Main js file to create canvas and do scripts for webpage
*/

import { Icosahedron } from './modules/icosahedron.js';
import { createShaderProgram, bindBuffers, linkAttributes } from './modules/necessaryFuncts.js';

let shaderProgram;

const main = (toDisplay) => {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2');

    gl.deleteProgram(shaderProgram);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    if (!gl) {
        alert('WebGL2 not supported');
        return;
    }

    const icosahedron = new Icosahedron();
    icosahedron.subdivideEdges();
    icosahedron.subdivideEdges();
    icosahedron.subdivideEdges();

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

        void main() {
            gl_FragColor = texture2D(texture, vTexture);
        }
    `;

    const buffers = bindBuffers(gl, icosahedron);
    
    let texData;
    if (toDisplay===0) {
        texData = icosahedron.getTexData();
    } else if (toDisplay===1) {
        texData = "images/earth.jpg";
    } else if (toDisplay===2) {
        texData = icosahedron.getHeightTexData();
    }

    shaderProgram = createShaderProgram(gl, vertexSource, fragmentSource, texData);

    linkAttributes(gl, buffers, shaderProgram);

    gl.useProgram(shaderProgram);
    gl.enable(gl.DEPTH_TEST);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    
    const matrix = mat4.create();
    
    mat4.translate(matrix, matrix, [0, 0, 0]);
    mat4.scale(matrix, matrix, [0.5, 0.5, 0.5]);
    
    const uniformLocation = gl.getUniformLocation(shaderProgram, 'matrix');
    gl.uniform1i(uniformLocation, 0);
    
    function animate() {
        requestAnimationFrame(animate);

        gl.useProgram(shaderProgram);

        //mat4.rotateX(matrix, matrix, Math.PI/2 / 200);
        mat4.rotateY(matrix, matrix, Math.PI/2 / 300);
        //mat4.rotateZ(matrix, matrix, Math.PI/2 / 300);

        gl.uniformMatrix4fv(uniformLocation, false, matrix);
        
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
        gl.clearColor(1, 1, 1, 1);
    
        gl.drawArrays(gl.TRIANGLES, 0, icosahedron.vertexData.length / 3);
    }

    animate();
}

main(0);

export default main;