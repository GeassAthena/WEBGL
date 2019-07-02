const VSHADER_SOURCE = document.getElementById('vertex-shader').textContent;
const FSHADER_SOURCE = document.getElementById('fragment-shader').textContent;
let canvas = document.getElementById('webgl');
let anglex = 30, angley = 30, step = 10;

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
    draw(gl, n);

    //键盘控制转动事件
    document.onkeydown = function (ev) {
        console.log(ev.key);
        switch (ev.keyCode) {
            case 39:
            case 65:
                anglex += step;
                break;
            case 37:
            case 68:
                anglex -= step;
                break;
            case 38:
            case 87:
                angley += step;
                break;
            case 40:
            case 83:
                angley -= step;
                break;
            default:
                break;
        }
        draw(gl, n);
    };
}

function draw(gl, n) {
    let u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    let normalMatrix = new Matrix4();
    //得到光线颜色和光线向量的uniform变量
    let u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    let u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
    //设置光线颜色
    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    //设置光线向量
    let lightDirection = new Vector3([0.5, 3.0, 4.0]);
    lightDirection.normalize();
    gl.uniform3fv(u_LightDirection, lightDirection.elements);

    //模型矩阵
    let modelMatrix = new Matrix4();
    modelMatrix.setTranslate(0, 0.5, 0);
    modelMatrix.rotate(anglex, 0, 0, 1);
    modelMatrix.rotate(angley, 0, 1, 0);
    //视图投影矩阵
    let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    let mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);
    mvpMatrix.multiply(modelMatrix);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    //清除颜色缓冲区和深度缓冲区
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLE_STRIP, n, gl.UNSIGNED_BYTE, 0);
}

function initVertexBuffer(gl) {
    let indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, polygon, gl.STATIC_DRAW);
    initArrayBuffer(gl, 'a_Position', vertices, 3);
    initArrayBuffer(gl, 'a_Color', colors, 3);
    initArrayBuffer(gl, 'a_Normal', normals, 3);
    return polygon.length;
}

function initArrayBuffer(gl, attribute, data, num) {
    let buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    let attri = gl.getAttribLocation(gl.program, attribute);
    gl.vertexAttribPointer(attri, num, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attri);
}


