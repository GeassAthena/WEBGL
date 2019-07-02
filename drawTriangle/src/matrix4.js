let VSHADER_SOURCE = document.getElementById('vertex-shader').textContent;
let FSHADER_SOURCE = document.getElementById('fragment-shader').textContent;

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
    let u_xformMatraix = gl.getUniformLocation(program, 'u_xformMatraix');
    let angle = 45.0;
    let xformMatraix = new Matrix4();
    xformMatraix.setTranslate(0.5, 0, 0);
    xformMatraix.rotate(angle, 0, 0, 1); //旋转角度和旋转轴

    gl.uniformMatrix4fv(u_xformMatraix, false, xformMatraix.elements);
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    let vertexes = [
        -0.25, 0,
        0, 0.5,
        0.25, 0
    ]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexes), gl.STATIC_DRAW);
    //清除画布
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //建立着色器中变量与缓冲区数据的连接
    gl.enableVertexAttribArray(a_Position);
    //size 维度， normalized ， stride 每次迭代前进大小， offset 起始读取位置的偏移量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    //根据坐标画图
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}