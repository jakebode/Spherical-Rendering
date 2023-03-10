/*
*   IN PROGRESS
*/

class Canvas {
    gl;
    
    // buffer objects created in bindBuffers()
    positionBuffer;
    colorBuffer;

    // shaders created in createShaders()
    vertexShader;
    fragmentShader;

    // program object to link shaders to a single object
    program;

    // references to location of position/color data in shader code
    positionRef;
    colorRef;

    // needed for animate()
    uniformLocations;

    // passes webgl drawing context for canvas to draw to
    constructor(drawingContext) {
        this.gl = drawingContext;
    }

    // only method that makes sense to me from this class
    bindBuffers(vertexData, colorData) {
        //create position buffer and attach data for vertices
        this.positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertexData), this.gl.STATIC_DRAW);
        
        // create color buffer and attach data for vertices
        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colorData), this.gl.STATIC_DRAW);
    }

    // takes arguments of shader language as strings
    createShaders(vert, frag) {
        this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(this.vertexShader, vert);
        this.gl.compileShader(this.vertexShader);

        this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(this.fragmentShader, frag);
        this.gl.compileShader(this.fragmentShader);
    }

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