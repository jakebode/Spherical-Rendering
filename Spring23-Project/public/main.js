/*
*   Author: Jake Bode
*   Main js file to create canvas and do scripts for webpage
*/

import { Icosahedron } from './modules/icosahedron.js';
import { createBuffers } from './modules/dataBuffers.js';
import { drawIcos } from './modules/drawIcos.js'

let cubeRotation = 0.0;
let deltaTime = 0;

main();

function main() {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('WebGL not supported');
        return;
    }

    var vertexSource = `
        precision highp float;

        attribute vec3 position;
        attribute vec2 texture;

        varying vec2 texCoord;
        uniform mat4 matrix;

        void main() {
            gl_Position = matrix * vec4(position, 1);
            texCoord = texture;
        }
    `;

    var fragmentSource = `
        precision highp float;

        // passed from vertexSource
        varying vec2 texCoord;

        // The texture
        uniform sampler2D texture;

        void main() {
            gl_FragColor = texture2D(texture, texCoord);
        }
    `;

    const shaderProgram = createShaderProgram(gl, vertexSource, fragmentSource);

    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
            textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
            uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
        },
    };

    const icosahedron = new Icosahedron();
    icosahedron.subdivideEdges();
    icosahedron.subdivideEdges();
    icosahedron.subdivideEdges();

    const buffers = createBuffers(gl, icosahedron);

    const texture = loadTexture(gl, 'uofa.jpg');
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let then = 0;

    function animate(now) {
        now *= 0.001;
        deltaTime = now - then;
        then = now;

        drawIcos(gl, programInfo, buffers, texture, cubeRotation);
        cubeRotation += deltaTime;

        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}
    // gl.useProgram(programInfo.program);
    // gl.enable(gl.DEPTH_TEST);

    // const uniformLocations = {
    //     matrix: gl.getUniformLocation(programInfo.program, 'matrix'),
    // };

    // const matrix = mat4.create();
    // mat4.translate(matrix, matrix, [0, 0, 0]);
    // mat4.scale(matrix, matrix, [0.5, 0.5, 0.5]);

    // function animate() {
    //     requestAnimationFrame(animate);
    //     //mat4.rotateY(matrix, matrix, Math.PI/2 / 70);
    //     //mat4.rotateX(matrix, matrix, Math.PI/2 / 70);
    //     //mat4.rotateZ(matrix, matrix, Math.PI/2 / 70);
    //     gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
        
    //     gl.disable(gl.CULL_FACE);
    //     gl.enable(gl.DEPTH_TEST);
    //     gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
    //     gl.clearColor(0, 0.5, 0, 1);

    //     gl.drawArrays(gl.TRIANGLES, 0, icosahedron.vertexData.length / 3);
    // }

    // animate();

function createShaderProgram(gl, vertexSource, fragmentSource) {
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    return program;
}

function loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
  
    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
    
        if (((image.width & (image.width - 1)) === 0) && (image.height & (image.height - 1)) === 0) {
            gl.generatedMipmap(gl.TEXTURE_2D);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }
    };
    image.src = url;
  
    return texture;
}
