import { Icosahedron } from './icosahedron.js';

function createBuffers(gl, icosahedron) {
    const positionBuffer = createPositionBuffer(gl, icosahedron);
    const textureCoordBuffer = createTextureBuffer(gl, icosahedron);

    return {
        position: positionBuffer,
        texture: textureCoordBuffer,
    };
}

function createPositionBuffer(gl, icos) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(icos.vertexData), gl.STATIC_DRAW);
    return positionBuffer;
}

function createTextureBuffer(gl, icos) {
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(icos.getTexCoords()), gl.STATIC_DRAW);
    return textureCoordBuffer;
}

export { createBuffers };