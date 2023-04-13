/*
*   IN PROGRESS
*/

class Canvas {
    gl;
    
    // buffer objects created in bindBuffers()
    positionBuffer;
    colorBuffer;
    textureBuffer;

    // shaders created in createShaders()
    vertexShader;
    fragmentShader;

    // program object to link shaders to a single object
    program;

    // references to location of position/color data in shader code
    positionRef;
    colorRef;
    textureRef;

    // needed for animate()
    uniformLocations;

    // passes webgl drawing context for canvas to draw to
    constructor(drawingContext) {
        this.gl = drawingContext;
    }

    // only method that makes sense to me from this class
    bindBuffers(vertexData, colorData, texCoords) {
        //create position buffer and attach data for vertices
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexData), this.gl.STATIC_DRAW);
        
        // create color buffer and attach data for vertices
        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colorData), this.gl.STATIC_DRAW);

        // texture buffer
        this.textureBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(texCoords), this.gl.STATIC_DRAW);
    }

    // takes arguments of shader language as strings
    createShaders(vert, frag) {
        this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(this.vertexShader, vert);
        this.gl.compileShader(this.vertexShader);

        this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(this.fragmentShader, frag);
        this.gl.compileShader(this.fragmentShader);

        const texture = this.gl.createTexture();
        this.gl.activeTexture(this.gl.TEXTURE0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    
        let level = 0,
            internalFormat = this.gl.RGBA,
            width = 1,
            height = 1,
            border = 0,
            srcFormat = this.gl.RGBA,
            srcType = this.gl.UNSIGNED_BYTE,
            pixel = new Uint8Array([0, 0, 255, 255]);
            this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
    
        const image = new Image();
        image.src = "images/earth.jpg";
        image.onload = () => {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
        
            this.gl.generateMipmap(this.gl.TEXTURE_2D);

            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
        };
    }

// go through u,v coordinates (phi, theta) to compare whether 
// consecutive triangles have theta angles differences greater
//  than 2pi / 5 ( do this when creating the regional mesh )

// if (Math.fabs(a-b) > 0.2 || Math.fabs(b-c) > 0.2 || 
// Math.fabs(a-c) > 0.2) each part as a flag ab, bc, ac

    initProgram() {
        this.program = this.gl.createProgram();
        this.gl.attachShader(this.program, this.vertexShader);
        this.gl.attachShader(this.program, this.fragmentShader);
        this.gl.linkProgram(this.program);
    }

    // binds the data from ths shaders to the program, to allow the vertices to be displayed
    linkAttributes() {
        this.positionRef = this.gl.getAttribLocation(this.program, 'position');
        this.gl.enableVertexAttribArray(this.positionRef);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.vertexAttribPointer(this.positionRef, 3, this.gl.FLOAT, false, 0, 0);
        
        this.colorRef = this.gl.getAttribLocation(this.program, 'color');
        this.gl.enableVertexAttribArray(this.colorRef);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.vertexAttribPointer(this.colorRef, 3, this.gl.FLOAT, false, 0, 0);

        this.textureRef = this.gl.getAttribLocation(this.program, 'texture');
        this.gl.enableVertexAttribArray(this.textureRef);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureBuffer);
        this.gl.vertexAttribPointer(this.textureRef, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.useProgram(this.program);
        this.gl.enable(this.gl.DEPTH_TEST);
    }

    animate(vertexData, x, y, z) {
        this.uniformLocations = {
            matrix: this.gl.getUniformLocation(this.program, 'matrix'),
        };
        
        const matrix = mat4.create();
        
        mat4.translate(matrix, matrix, [0, 0, 0]);
        mat4.scale(matrix, matrix, [1, 1, 1]);
        
        this.#animate(vertexData, matrix, x, y, z);
    }

    #animate(vertexData, matrix, x, y, z) {
        requestAnimationFrame(this.animate);
        if (y)
            mat4.rotateY(matrix, matrix, Math.PI/2 / 70);
        if (x)
            mat4.rotateX(matrix, matrix, Math.PI/2 / 70);
        if (z)
            mat4.rotateZ(matrix, matrix, Math.PI/2 / 70);
        this.gl.uniformMatrix4fv(this.uniformLocations.matrix, false, matrix);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, vertexData.length / 3);
    }
}

export { Canvas };