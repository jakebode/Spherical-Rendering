/*
*   Author: Jake Bode
*   Defines class for icosahedron 3d shape to render in webgl canvas
*/

class Icosahedron {
    // ==================================================================================
    //  Defining vertex data points, order and grouping of vertices in the 3d rendering
    //
    static vertices;
    // each subarray contains verticies for a face 
    static indices;
    
    vertexData;

    // RGB color data for each vertex. Each set of three integers represents RGB 
    //  for one vertex, each set of 9 ints represents one face
    static colorData;

    constructor() {
        this.vertices = [
            0,0,-1.902,                 // V0
            0,0,1.902,                  // V1
            -1.701,0,-0.8507,           // V2
            1.701,0,0.8507,             // V3
            1.376,-1.000,-0.8507,       // V4
            1.376,1.000,-0.8507,        // V5
            -1.376,-1.000,0.8507,       // V6
            -1.376,1.000,0.8507,        // V7
            -0.5257,-1.618,-0.8507,     // V8
            -0.5257,1.618,-0.8507,      // V9
            0.5257,-1.618,0.8507,       // V10
            0.5257,1.618,0.8507         // V11
        ];

        this.indices = [
            [1,11,7],[1,7,6],[1,6,10],[1,10,3],
            [1,3,11],[4,8,0],[5,4,0],[9,5,0],
            [2,9,0],[8,2,0],[11,9,7],[7,2,6],
            [6,8,10],[10,4,3],[3,5,11],[4,10,8],
            [5,3,4],[9,11,5],[2,7,9],[8,6,2]
        ];

        this.vertexData = this.getVertices();

        // currently unused, in favor of shadow-like shading calculated from position vectors
        this.colorData = [
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
    }

    // Constructor initializes vertex and color data
    // Will be implemented differently to allow for compatibility with more object types
    //  in more general class in the future!
    // ==================================================================================

    /////////////////////////////////////////////////////////////////////////
    // takes pairings of verticies to create an array containing all vertexes
    //  needed to display the Icosahedron with triangles
    getVertices() {
        var vd = [];
        for (let i = 0; i < this.indices.length; i++) {
            for (let j = 0; j < 3; j++) {
                vd.push(this.vertices[this.indices[i][j] * 3] / 3);
                vd.push(this.vertices[this.indices[i][j] * 3 + 1] / 3);
                vd.push(this.vertices[this.indices[i][j] * 3 + 2] / 3);
            }
        }
        return vd;
    }

    subdivideEdges() {
        var newVertices = [];

        for (let i = 0; i < this.vertexData.length; i+=9) {
            var v1 = this.#normalize(this.vertexData.slice(i, i+3));
            var v2 = this.#normalize(this.vertexData.slice(i+3, i+6));
            var v3 = this.#normalize(this.vertexData.slice(i+6, i+9));
            var mp1 = this.#getMidpoint(v1, v2);
            var mp2 = this.#getMidpoint(v3, v1);
            var mp3 = this.#getMidpoint(v2, v3);

            newVertices = newVertices.concat(v1);
            newVertices = newVertices.concat(mp1);
            newVertices = newVertices.concat(mp2);

            newVertices = newVertices.concat(v2);
            newVertices = newVertices.concat(mp1);
            newVertices = newVertices.concat(mp3);

            newVertices = newVertices.concat(v3);
            newVertices = newVertices.concat(mp2);
            newVertices = newVertices.concat(mp3);

            newVertices = newVertices.concat(mp1);
            newVertices = newVertices.concat(mp2);
            newVertices = newVertices.concat(mp3);
        }
        console.log(newVertices);
        this.vertexData = newVertices;
    }

    #getMidpoint(v1, v2) {
        return this.#normalize([(v1[0]+v2[0])/2, (v1[1]+v2[1])/2, (v1[2]+v2[2])/2]);
    }

    #normalize(vec) {
        var norm = Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1] + vec[2]*vec[2]);
        return [vec[0]/norm, vec[1]/norm, vec[2]/norm];
    }

}

export { Icosahedron };