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
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    let level = 0,
        internalFormat = gl.RGBA,
        width = 1,
        height = 1,
        border = 0,
        srcFormat = gl.RGBA,
        srcType = gl.UNSIGNED_BYTE,
        pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

    const image = new Image();
    image.src = url;
    image.onload = () => {
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
    
        gl.generateMipmap(gl.TEXTURE_2D);
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    };
  
    return texture;
}

function bindBuffers(gl, icosahedron) {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(icosahedron.vertexData), gl.STATIC_DRAW);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(icosahedron.getNormals()), gl.STATIC_DRAW);

    const textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, icosahedron.getTexCoords(), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        color: colorBuffer,
        texture: textureBuffer,
    };
}

function linkAttributes(gl, buffers, program) {
    const positionRef = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionRef);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(positionRef, 3, gl.FLOAT, false, 0, 0);
    
    const colorRef = gl.getAttribLocation(program, 'color');
    gl.enableVertexAttribArray(colorRef);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(colorRef, 3, gl.FLOAT, false, 0, 0);
    
    const textureRef = gl.getAttribLocation(program, 'texture');
    gl.enableVertexAttribArray(textureRef);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texture);
    gl.vertexAttribPointer(textureRef, 3, gl.FLOAT, false, 0, 0);   
}

export { createShaderProgram, loadTexture, bindBuffers, linkAttributes };