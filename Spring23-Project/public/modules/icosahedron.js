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

        let j = 0;
        let phi1, phi2, phi3, theta1, theta2, theta3;

        for (let i = 0; i < this.vertexData.length; i+=9) {
            let x1 = this.vertexData[i],
                y1 = this.vertexData[i+1],
                z1 = this.vertexData[i+2];
            let x2 = this.vertexData[i+3],
                y2 = this.vertexData[i+4],
                z2 = this.vertexData[i+5];
            let x3 = this.vertexData[i+6],
                y3 = this.vertexData[i+7],
                z3 = this.vertexData[i+8];
            
            if (x1=== 0 && y1 === 0) {
                theta1 = 0;
            } else if (x1 < 0) {
                theta1 = Math.atan(y1/x1) + Math.PI;
            } else {
                theta1 = Math.atan(y1/x1);
            }
            phi1 = Math.acos(z1);

            if (x2=== 0 && y2 === 0) {
                theta2 = 0;
            } else if (x2 < 0) {
                theta2 = Math.atan(y2/x2) + Math.PI;
            } else {
                theta2 = Math.atan(y2/x2);
            }
            phi2 = Math.acos(z2);

            if (x3=== 0 && y3 === 0) {
                theta3 = 0;
            } else if (x3 < 0) {
                theta3 = Math.atan(y3/x3) + Math.PI;
            } else {
                theta3 = Math.atan(y3/x3);
            }
            phi3 = Math.acos(z3);

            if (y1 <= 0 && y2 <= 0 && y3 <= 0) {
                let f1 = (x1 >= 0), f2 = (x2 >= 0), f3 = (x3 >= 0);
                if (!((f1 && f2 && f3) || (!f1 && !f2 && !f3))) {
                    if (f1) {
                        theta1 += 2* Math.PI;
                    }
                    if (f2) {
                        theta2 += 2*Math.PI;
                    }
                    if (f3) {
                        theta3 += 2*Math.PI;
                    }
                }
            }
            
            if (phi1 === 0 || phi1 === Math.PI) {
                theta1 = 0.5 * (theta2 + theta3);
            } 
            if (phi2 === 0 || phi2 === Math.PI) {
                theta2 = 0.5 * (theta1 + theta3);
            } 
            if (phi3 === 0 || phi3 === Math.PI) {
                theta3 = 0.5 * (theta1 + theta2);
            }

            arr[j++] = 0.5*theta1 / Math.PI;
            arr[j++] = phi1 /Math.PI;
            arr[j++] = 0.5*theta2 / Math.PI;
            arr[j++] = phi2 /Math.PI;
            arr[j++] = 0.5*theta3 / Math.PI;
            arr[j++] = phi3 /Math.PI;
        }

        return arr;
    }

    #phiFunc(r) {
        return (r>1) ? 0 : (1 + 2*r*r*r - 3*r*r);
    }

    #hash(i, j, k, random, length) {
        return random[3*(i + length*j + length*length*k)];
    }

    #dist(x, i, y, j, z, k) {
        return Math.sqrt((x-i)*(x-i) + (y-j)*(y-j) + (z-k)*(z-k));
    }

    #noise(x, y, z, scale, random, length) {
        x *= scale;
        y *= scale;
        z *= scale;
        x += 0.5 * length;
        y += 0.5 * length;
        z += 0.5 * length;
        let i = Math.floor(x),
            j = Math.floor(y),
            k = Math.floor(z);
        let hash1 = this.#hash(i, j, k, random, length),
            phi1 = this.#phiFunc(this.#dist(x, i, y, j, z, k)),
            hash2 = this.#hash(i, j, k+1, random, length),
            phi2 = this.#phiFunc(this.#dist(x, i, y, j, z, k+1)),
            hash3 = this.#hash(i, j+1, k, random, length),
            phi3 = this.#phiFunc(this.#dist(x, i, y, j+1, z, k)),
            hash4 = this.#hash(i, j+1, k+1, random, length),
            phi4 = this.#phiFunc(this.#dist(x, i, y, j+1, z, k+1)),
            hash5 = this.#hash(i+1, j, k, random, length),
            phi5 = this.#phiFunc(this.#dist(x, i+1, y, j, z, k)),
            hash6 = this.#hash(i+1, j, k+1, random, length),
            phi6 = this.#phiFunc(this.#dist(x, i+1, y, j, z, k+1)),
            hash7 = this.#hash(i+1, j+1, k, random, length),
            phi7 = this.#phiFunc(this.#dist(x, i+1, y, j+1, z, k)),
            hash8 = this.#hash(i+1, j+1, k+1, random, length),
            phi8 = this.#phiFunc(this.#dist(x, i+1, y, j+1, z, k+1));

            let noiseVal = (hash1*phi1 + hash2*phi2 + hash3*phi3 + hash4*phi4 
                + hash5*phi5 + hash6*phi6 + hash7*phi7 + hash8*phi8);
            return noiseVal;
    }

    getTexData() {
        var random = new Float32Array(3000000);
        for (let i = 0; i < 3000000; i++) {
            random[i] = Math.random();
        }

        var data = new Uint8Array(1000 * 500 * 4);
        
        for (let j = 0; j < data.length; j+=4) {
            let u = ((j/4)%1000)/1000,
                v = Math.floor((j/4)/1000)/500,
                x = Math.sin(Math.PI*v) * Math.cos(2*Math.PI*u),
                y = Math.sin(Math.PI*v) * Math.sin(2*Math.PI*u),
                z = Math.cos(Math.PI*v);
            // let i = j << 2;
            // let x = (i % 1000) * 0.1,
            //     y = Math.floor(i / 1000) * 0.1,
            //     z = Math.floor(i / 1000000) * 0.1;

            let val = 255 * this.#noise(x, y, z, 10, random, 100);
            data[j] = val;
            data[j+1] = val;
            data[j+2] = val;
            data[j+3] = 255;
        }

        console.log(data);
        return data;
    }

}

export { Icosahedron };