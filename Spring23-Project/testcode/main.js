const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

// =================================================================================
//  Defining vertex data points, order and grouping of vertices in the 3d rendering
//
const vertices = [
    0,0,-1.902,                 // V1
    0,0,1.902,                  // V2
    -1.701,0,-0.8507,           // V3
    1.701,0,0.8507,             // V4
    1.376,-1.000,-0.8507,       // V5
    1.376,1.000,-0.8507,        // V6
    -1.376,-1.000,0.8507,       // V7
    -1.376,1.000,0.8507,        // V8
    -0.5257,-1.618,-0.8507,     // V9
    -0.5257,1.618,-0.8507,      // V10
    0.5257,-1.618,0.8507,       // V11
    0.5257,1.618,0.8507         // V12
];

// each subarray contains verticies
const indices = [
    [1,11,7],[1,7,6],[1,6,10],[1,10,3],
    [1,3,11],[4,8,0],[5,4,0],[9,5,0],
    [2,9,0],[8,2,0],[11,9,7],[7,2,6],
    [6,8,10],[10,4,3],[3,5,11],[4,10,8],
    [5,3,4],[9,11,5],[2,7,9],[8,6,2]
];

// takes pairings of verticies to create an array containing all vertexes
//  needed to display the Icosahedron with triangles
function getVertices() {
    vd = [];
    for (let i = 0; i < indices.length; i++) {
        for (let j = 0; j < 3; j++) {
            vd.push(vertices[indices[i][j] * 3] / 3);
            vd.push(vertices[indices[i][j] * 3 + 1] / 3);
            vd.push(vertices[indices[i][j] * 3 + 2] / 3);
        }
    }
    return vd;
}

const vertexData = getVertices();

/* VERTEX DATA FOR TETRAHEDRON
const vertexData = [
    0.5, 0.5, 0.5,  0.5, -0.5, -0.5,  -0.5, 0.5, -0.5,   // Face 1
    0.5, 0.5, 0.5,  0.5, -0.5, -0.5,  -0.5, -0.5, 0.5,   // Face 2
    0.5, 0.5, 0.5,  -0.5, 0.5, -0.5,  -0.5, -0.5, 0.5,   // Face 3
    0.5, -0.5, -0.5,  -0.5, 0.5, -0.5,  -0.5, -0.5, 0.5  // Face 4
];
*/

// RGB color data for each vertex 
//  each set of three integers represents RGB for one vertex, each set of 9 ints represents one face
const colorData = [
    1, 0, 0,  1, 0, 0,  1, 0, 0, // color 1
    0, 1, 0,  0, 1, 0,  0, 1, 0, // color 2
    0, 0, 1,  0, 0, 1,  0, 0, 1, // color 3
    1, 1, 0,  1, 1, 0,  1, 1, 0, // color 4

    0, 1, 0,  0, 1, 0,  0, 1, 0, // color 2
    1, 0, 0,  1, 0, 0,  1, 0, 0, // color 1
    0, 0, 1,  0, 0, 1,  0, 0, 1, // color 3
    1, 1, 0,  1, 1, 0,  1, 1, 0, // color 4

    1, 0, 0,  1, 0, 0,  1, 0, 0, // color 1
    0, 1, 0,  0, 1, 0,  0, 1, 0, // color 2
    1, 1, 0,  1, 1, 0,  1, 1, 0, // color 4
    0, 0, 1,  0, 0, 1,  0, 0, 1, // color 3

    1, 0, 0,  1, 0, 0,  1, 0, 0, // color 1
    0, 1, 0,  0, 1, 0,  0, 1, 0, // color 2
    0, 0, 1,  0, 0, 1,  0, 0, 1, // color 3
    1, 1, 0,  1, 1, 0,  1, 1, 0, // color 4

    1, 0, 0,  1, 0, 0,  1, 0, 0, // color 1
    0, 0, 1,  0, 0, 1,  0, 0, 1, // color 3
    0, 1, 0,  0, 1, 0,  0, 1, 0, // color 2
    1, 1, 0,  1, 1, 0,  1, 1, 0, // color 4
];

// gets the midpoint of two vertices (given as arrays of length dim = 3)
function getMidpoint(v1, v2) {
    mp = [];
    for (let i = 0; i < v1.length; i++) {
        mp.push(v1[i] + v2[i] / 2);
    }
    return mp;
}

// dataArr must be an array of length % 3 = 0
function splitEdgeInTwo(dataArr) {
    newVertices = [];
    for (let i = 0; i < dataArr.length; i+=3) {
        for (let j = 0; j < 3; j++) {
            newVertices.push();
        }
    }
}

console.log(vertexData);

// END of vertex data and color data arrays
// ===========================================================================

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;
attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;
uniform mat4 matrix;
void main() {
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;
varying vec3 vColor;
void main() {
    gl_FragColor = vec4(vColor, 1);
}
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionRef = gl.getAttribLocation(program, 'position');
gl.enableVertexAttribArray(positionRef);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionRef, 3, gl.FLOAT, false, 0, 0);

const colorRef = gl.getAttribLocation(program, 'color');
gl.enableVertexAttribArray(colorRef);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorRef, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
    matrix: gl.getUniformLocation(program, 'matrix'),
};

const matrix = mat4.create();

mat4.translate(matrix, matrix, [0, 0, 0]);
mat4.scale(matrix, matrix, [1, 1, 1]);

function animate() {
    requestAnimationFrame(animate);
    //mat4.rotateY(matrix, matrix, Math.PI/2 / 70);
    //mat4.rotateX(matrix, matrix, Math.PI/2 / 70);
    //mat4.rotateZ(matrix, matrix, Math.PI/2 / 70);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}

animate();

