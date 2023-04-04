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
                var temp = [this.vertices[this.indices[i][j] * 3] / 3, this.vertices[this.indices[i][j] * 3 + 1] / 3, this.vertices[this.indices[i][j] * 3 + 2] / 3];
                
                temp = this.#normalize(temp);

                vd = vd.concat(temp);
                //vd.push(this.vertices[this.indices[i][j] * 3] / 3);
                //vd.push(this.vertices[this.indices[i][j] * 3 + 1] / 3);
                //vd.push(this.vertices[this.indices[i][j] * 3 + 2] / 3);

            }
        }
        //console.log(vd);
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
            newVertices = newVertices.concat(mp3);
            newVertices = newVertices.concat(mp1);

            newVertices = newVertices.concat(v3);
            newVertices = newVertices.concat(mp2);
            newVertices = newVertices.concat(mp3);

            newVertices = newVertices.concat(mp1);
            newVertices = newVertices.concat(mp3);
            newVertices = newVertices.concat(mp2);
        }
        //console.log(newVertices);
        this.vertexData = newVertices;
    }

    #getMidpoint(v1, v2) {
        return this.#normalize([(v1[0]+v2[0])/2, (v1[1]+v2[1])/2, (v1[2]+v2[2])/2]);
    }

    #normalize(vec) {
        var norm = Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1] + vec[2]*vec[2]);
        return [vec[0]/norm, vec[1]/norm, vec[2]/norm];
    }

    // getNormals() {
    //     var normals = [];
    //     for (let i = 0; i < this.vertexData.length; i+=9) {

    //         var crossProduct = this.#normalize(this.#cross(this.vertexData.slice(i, i+9)));
            
    //         normals = normals.concat(crossProduct);
    //         normals = normals.concat(crossProduct);
    //         normals = normals.concat(crossProduct);
    //     }
    //     return normals;
    // }

    getNormals() {
        var normals=[];
        for (let i = 0; i < this.vertexData.length; i+=3) {
            normals = normals.concat(this.vertexData.slice(i, i+3));    
        }
        return normals;
    }

    #testCross(v) {
        var p1 = v[0] - v[3];
        var p2 = v[1] - v[4];
        var p3 = v[2] - v[5];
        var q1 = v[3] - v[6];
        var q2 = v[4] - v[7];
        var q3 = v[5] - v[8];

        var cross = [p2*q3-p3*q2, p1*q3-p3*q1, p1*q2-p2*q1];
        
        if (this.#dotProduct([v[0], v[1], v[2]], cross) < 0) {
            return [0,0,1];
        } else {
            return [0,0,0];
            ///return [0-cross[0], 0-cross[1], 0-cross[2]];
        }
    }

    #cross(v) {
        var p1 = v[0] - v[3];
        var p2 = v[1] - v[4];
        var p3 = v[2] - v[5];
        var q1 = v[3] - v[6];
        var q2 = v[4] - v[7];
        var q3 = v[5] - v[8];

        var cross = [p2*q3-p3*q2, p3*q1-p1*q3, p1*q2-p2*q1];
        
        if (this.#dotProduct([v[0], v[1], v[2]], cross) > 0) {
            return cross;
        } else {
            return [0-cross[0], 0-cross[1], 0-cross[2]];
        }
    }

    #dotProduct(v1, v2) {
        return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
    }

    getTexCoords() {
        let arr = new Float32Array(this.vertexData.length * (2/3));
        let j = 0,
            phi, theta,
            eps = -2*Math.PI/7   ;
        for (let i = 0; i < this.vertexData.length; i+=3) {
            let x = this.vertexData[i],
                y = this.vertexData[i+1],
                z = this.vertexData[i+2];
            if (x === 0 && y === 0) {
                theta = 0;
            } else if (x < 0) {
                theta = Math.atan(y/x) + Math.PI;
            } else {
                theta = Math.atan(y/x);
            }
          
            phi = Math.acos(z);


            arr[j++] = 0.5*theta / Math.PI;
            arr[j++] = phi /Math.PI;
        }

        return arr;
    }

}

export { Icosahedron };