const VSHADER_SOURCE = document.getElementById('vertex-shader').textContent;
const FSHADER_SOURCE = document.getElementById('fragment-shader').textContent;
let canvas = document.getElementById('webgl');
let anglex = 0, angley = 0;

function main() {
    let gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        console.log("get gl failed!");
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    //启用深度缓存区
    gl.enable(gl.DEPTH_TEST);
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log("failed to create program");
        return false;
    }
    let n = initVertexBuffer(gl);
    let u_Matrix = gl.getUniformLocation(gl.program, 'u_Matrix');
    draw(gl, n, u_Matrix);
    document.onkeydown = function (ev) {
        console.log(ev.key);
        switch (ev.keyCode) {
            case 39:
            case 65:
                anglex += 25.0;
                break;
            case 37:
            case 68:
                anglex -= 25.0;
                break;
            case 38:
            case 87:
                angley += 25;
                break;
            case 40:
            case 83:
                angley -= 25;
                break;
            default:
                break;
        }
        draw(gl, n, u_Matrix);
    };
}

function draw(gl, n, u_Matrix) {
    //视图矩阵
    let viewMatrix = new Matrix4();
    viewMatrix.setLookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    //模型矩阵
    let modelMatrix = new Matrix4();
    modelMatrix.setRotate(anglex, 0, 0, 1);
    modelMatrix.rotate(angley, 0, 1, 0)
    modelMatrix.translate(0.0, 0.0, 0.0);
    //投影矩阵
    let projMatrix = new Matrix4();
    projMatrix.setPerspective(30, 1, 1, 100);
    //投影 * 视图 * 模型
    let matrix = projMatrix.multiply(viewMatrix.multiply(modelMatrix));
    gl.uniformMatrix4fv(u_Matrix, false, matrix.elements);

    //清除颜色缓冲区和深度缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLE_STRIP, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffer(gl) {
    let vertexColor = new Float32Array(vertex);

    let indexBuffer = gl.createBuffer();
    let vertexColorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, polygon, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColor, gl.STATIC_DRAW);

    let FSIZE = vertexColor.BYTES_PER_ELEMENT;

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3);
    gl.enableVertexAttribArray(a_Color);

    return polygon.length;
}


