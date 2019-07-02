const VSHADER_SOURCE = document.getElementById('vertex-shader').textContent;
const FSHADER_SOURCE = document.getElementById('fragment-shader').textContent;
let eye_x = 0.20, eye_y = 0.25, eye_z = 0.25, near = 0.0, far = 2.0;

function main() {
    let canvas = document.getElementById('webgl');
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
    let u_ModelViewMatrix = gl.getUniformLocation(gl.program, 'u_ModelViewMatrix');

    document.onkeydown = function (ev) {
        keydown(gl, ev, n, u_ModelViewMatrix);
    }
    draw(gl, n, u_ModelViewMatrix);

}

function initVertexBuffer(gl) {
    let vertices = new Float32Array([
        //顶点的坐标和颜色
        0.0, 0.5, -0.4, 0.4, 1.0, 0.4, // 绿色三角形，在最后面的三个点
        -0.5, -0.5, -0.4, 0.4, 1.0, 0.4,
        0.5, -0.5, -0.4, 1.0, 0.4, 0.4,

        0.5, 0.4, -0.2, 1.0, 0.4, 0.4, // 黄色三角形，在中间的三个点
        -0.5, 0.4, -0.2, 1.0, 1.0, 0.4,
        0.0, -0.6, -0.2, 1.0, 1.0, 0.4,

        0.0, 0.5, 0.0, 0.4, 0.4, 1.0,  // 蓝色三角形，在最前面的三个点
        -0.5, -0.5, 0.0, 0.4, 0.4, 1.0,
        0.5, -0.5, 0.0, 1.0, 0.4, 0.4
    ]);
    let n = 9;
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

function draw(gl, n, u_ModelViewMatrix) {
    //设置旋转角
    let projMatrix = new Matrix4();
    //设置视点、视线、上方向
    let viewMatrix = new Matrix4();
    projMatrix.setOrtho(-1, 1, -1, 1, 0.0, 2.0);
    viewMatrix.setLookAt(0.20, 0.20, 0.25, 0, 0, 0, 0, 1, 0);
    let modelViewMatrix = viewMatrix.multiply(projMatrix);
    gl.uniformMatrix4fv(u_ModelViewMatrix, false, modelViewMatrix.elements);

    //展示near、far的值
    let nf = document.getElementById('near_far');
    nf.innerHTML = 'near : ' + Math.round(near * 100) / 100 + " far : " + Math.round(far * 100) / 100;

    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, n)
}

function keydown(gl, ev, n, u_ModelViewMatrix) {
    console.log(ev.key);
    switch (ev.keyCode) {
        case 39:
            near += 0.01;
            break;
        case 37:
            near -= 0.01;
            break;
        case 38:
            far += 0.01;
            break;
        case 40:
            far -= 0.01;
            break;
        case 87:
            eye_y -= 0.02;
            break;
        case 83:
            eye_y += 0.02;
            break;
        case 65:
            eye_x += 0.02;
            break;
        case 68:
            eye_x -= 0.02;
            break;
        default:
            break;
    }
    draw(gl, n, u_ModelViewMatrix);
}

