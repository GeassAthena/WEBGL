const VSHADER_SOURCE = document.getElementById('vertex-shader').textContent;
const FSHADER_SOURCE = document.getElementById('fragment-shader').textContent;
let canvas = document.getElementById('webgl');


function main() {
    let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        console.log("get gl failed!");
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("failed to create program");
        return false;
    }
    let n = initVertexBuffer(gl);
    let u_Matrix = gl.getUniformLocation(gl.program, 'u_Matrix');
    draw(gl, n, u_Matrix);
}

function draw(gl, n, u_Matrix) {
    //视图矩阵
    let viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0,0,5,0,0,-100,0,1,0);
    //模型矩阵
    let modelMatrix = new Matrix4();
    modelMatrix.setRotate(0, 0, 0, 1);
    modelMatrix.translate(0.0, 0.0, 0.0);
    //投影矩阵
    let projMatrix = new Matrix4();
    projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
    //投影 * 视图 * 模型
    let matrix = projMatrix.multiply(viewMatrix.multiply(modelMatrix));
    gl.uniformMatrix4fv(u_Matrix, false, matrix.elements);
    //启用深度缓存区
    gl.enable(gl.DEPTH_TEST);
    //清除颜色缓冲区和深度缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n);
}

function initVertexBuffer(gl) {
    let vertices = new Float32Array([
        // 右侧的三个三角形

        0.75, 1.0, 0.0, 0.4, 0.4, 1.0,  // 前面的蓝色
        0.25, -1.0, 0.0, 0.4, 0.4, 1.0,
        1.25, -1.0, 0.0, 1.0, 0.4, 0.4,

        0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // 中间的黄色
        0.25, -1.0, -2.0, 1.0, 1.0, 0.4,
        1.25, -1.0, -2.0, 1.0, 0.4, 0.4,

        0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // 后面的绿色
        0.25, -1.0, -4.0, 0.4, 1.0, 0.4,
        1.25, -1.0, -4.0, 1.0, 0.4, 0.4,

        // 左侧的三个三角形
        -0.75, 1.0, -4.0, 0.4, 1.0, 0.4, // 后面的绿色
        -1.25, -1.0, -4.0, 0.4, 1.0, 0.4,
        -0.25, -1.0, -4.0, 1.0, 0.4, 0.4,

        -0.75, 1.0, -2.0, 1.0, 1.0, 0.4, // 中间的黄色
        -1.25, -1.0, -2.0, 1.0, 1.0, 0.4,
        -0.25, -1.0, -2.0, 1.0, 0.4, 0.4,

        -0.75, 1.0, 0.0, 0.4, 0.4, 1.0,  // 前面的蓝色
        -1.25, -1.0, 0.0, 0.4, 0.4, 1.0,
        - 0.25, -1.0, 0.0, 1.0, 0.4, 0.4
    ]);
    let n = 18;
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    let FSIZE = vertices.BYTES_PER_ELEMENT;
    
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return n;
}


