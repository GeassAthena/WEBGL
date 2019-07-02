let VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'uniform vec4 u_Translation;\n' +
    'uniform vec2 u_B;\n' +
    'void main() {\n' +
    ' gl_Position.x = a_Position.x * u_B.x - a_Position.y * u_B.y;\n' +
    ' gl_Position.y = a_Position.x * u_B.y + a_Position.y * u_B.x;\n' +
    ' gl_Position.z = a_Position.z;\n' +
    ' gl_Position.w = a_Position.w;\n' +
    ' gl_PointSize = 10.0;\n' +
    '}\n';
let FSHADER_SOURCE =
    'precision mediump float;\n' +
    'uniform vec4 vColor;\n' +
    'void main() {\n' +
    ' gl_FragColor = vec4(1.0,0.0,0.0,1.0);\n' +
    '}\n';

function main() {

    let canvas = document.getElementById('webgl');
    let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
        console.log("get gl failed!");
        return false;
    }
    //创建program
    let program = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    if (!program) {
        console.log("failed to create program");
        return false;
    }
    gl.useProgram(program);
    let a_Position = gl.getActiveAttrib(program, 'a_Position');
    let u_Translation = gl.getUniformLocation(program, 'u_Translation');
    let u_B = gl.getUniformLocation(program, 'u_B');
    let angle = 45.0;
    let cosB = Math.cos(Math.PI * angle / 180.0);
    let sinB = Math.sin(Math.PI * angle / 180.0);
    gl.uniform2f(u_B, cosB, sinB);
    gl.uniform4f(u_Translation, 0.0, 0.0, 0.0, 0.0);
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    let vertices = [
        -0.25, 0,
        0, 0.5,
        0.25, 0
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    //清除画布
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //建立着色器中变量与缓冲区数据的连接
    gl.enableVertexAttribArray(a_Position);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //根据坐标画图
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

// function createProgram(gl, vShader, fShader) {
//     let vshader = gl.createShader(gl.VERTEX_SHADER);
//     let fshader = gl.createShader(gl.FRAGMENT_SHADER);
//     gl.shaderSource(vshader, vShader);
//     gl.shaderSource(fshader, fShader);
//     gl.compileShader(vshader);
//     if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
//         console.log("could not compile shader:" + gl.getShaderInfoLog(vshader));
//     }
//     gl.compileShader(fshader);
//     if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
//         console.log("could not compile shader:" + gl.getShaderInfoLog(fshader));
//     }
//     let program = gl.createProgram();
//     gl.attachShader(program, vshader);
//     gl.attachShader(program, fshader);
//     gl.linkProgram(program);
//     let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
//     if (!linked) {
//         var error = gl.getProgramInfoLog(program);
//         console.log("Failed to link program: " + error);
//         gl.deleteProgram(program);
//         gl.deleteShader(fragmentShader);
//         gl.deleteShader(vertexShader);
//         return null
//     }
//     return program;
// }

