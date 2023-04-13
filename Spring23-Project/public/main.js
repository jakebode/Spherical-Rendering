/*
*   Author: Jake Bode
*   Main js file to create canvas and do scripts for webpage
*/

// sample perlin noise in js or shader
// perlin3(x,y,z)
// implement 3d texture 

// get perlin, open simplex noise


import { Icosahedron } from './modules/icosahedron.js';
import { createShaderProgram, bindBuffers, linkAttributes } from './modules/dataBuffers.js';

main();

function main() {
    const canvas = document.querySelector('canvas');
    const gl = canvas.getContext('webgl2');

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

        // Uniforms
        uniform float time;
        uniform vec2 resolution;
        
        // Constants
        const float PI = 3.141592653589793238;
        
        // Perlin Noise functions
        float random (vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        float noise (vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            
            // Four corners in 2D of a tile
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
            
            vec2 u = f * f * (3.0 - 2.0 * f);
            
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        
        float turbulence (vec2 st, float freq) {
            float t = -0.5;
            for (float i = 1.0; i <= 9.0; i++) {
                float power = pow(2.0, i);
                t += abs(noise(st * freq * power) / power);
            }
            return t;
        }
        
        // Sphere mapping function
        vec2 getSphereUV (vec3 pos) {
            float lat = asin(pos.y);
            float lon = atan(pos.x, pos.z);
            return vec2(lon / (2.0 * PI) + 0.5, lat / PI + 0.5);
        }
        
        // Main function
        void main() {
            vec2 uv = gl_FragCoord.xy / resolution.xy;
            
            // Get position on the sphere
            vec3 pos = vec3(sin(uv.y * PI) * cos(uv.x * 2.0 * PI),
                            sin(uv.y * PI) * sin(uv.x * 2.0 * PI),
                            cos(uv.y * PI));
            
            // Generate Perlin noise
            float noiseValue = turbulence(pos.xy, 2.0);
            
            // Map noise to color
            vec3 color = vec3(noiseValue);
            
            // Map color to texture coordinates
            vec2 texCoord = getSphereUV(pos);
            
            // Output color
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    const buffers = bindBuffers(gl, icosahedron);

    const shaderProgram = createShaderProgram(gl, vertexSource, fragmentSource, 'earth.jpg');

    linkAttributes(gl, buffers, shaderProgram);

    gl.useProgram(shaderProgram);
    gl.enable(gl.DEPTH_TEST);

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const uniformLocations = {
        matrix: gl.getUniformLocation(shaderProgram, 'matrix'),
    };
    
    const matrix = mat4.create();
    
    mat4.translate(matrix, matrix, [0, 0, 0]);
    mat4.scale(matrix, matrix, [0.5, 0.5, 0.5]);
    
    function animate() {
        requestAnimationFrame(animate);

        mat4.rotateX(matrix, matrix, Math.PI/2 / 200);
        mat4.rotateY(matrix, matrix, Math.PI/2 / 300);
        //mat4.rotateZ(matrix, matrix, Math.PI/2 / 300);

        gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
        
        gl.disable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT, gl.DEPTH_BUFFER_BIT);
        gl.clearColor(1, 1, 1, 1);
    
        gl.drawArrays(gl.TRIANGLES, 0, icosahedron.vertexData.length / 3);
    }
    
    animate();
}
