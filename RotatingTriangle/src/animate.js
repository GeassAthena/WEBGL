const VSHADER_SOURCE = document.getElementById('vertex-shader').textContent;
const FSHADER_SOURCE = document.getElementById('fragment-shader').textContent;
const ANGLE_STEP = 45.0; //每秒变化的角度
const SCALE_STEP = 0.2;  //每秒变化的大小
let isRotating = true;   //记录旋转状态

function main() {
    let canvas = document.getElementById('webgl');
    let gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
        console.log("get gl failed!");
        return false;
    }
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //创建program
    let program = createProgram(gl, VSHADER_SOURCE, FSHADER_SOURCE);
    if (!program) {
        console.log("failed to create program");
        return false;
    }
    let a_Position = gl.getActiveAttrib(program, 'a_Position');
    initVertex(gl, a_Position);
    let u_xformMatraix = gl.getUniformLocation(program, 'u_xformMatraix');
    gl.useProgram(program);
    let modelMatrix = new Matrix4();
    let cur_angle = 0.0;
    let cur_scale = 1.0;
    let rid;
    let tick = function () {
        let res = animate(cur_angle, cur_scale); //更新旋转角和大小
        cur_angle = res[0];
        cur_scale = res[1];
        modelMatrix.setRotate(cur_angle, 0, 0, 1);
        modelMatrix.scale(cur_scale, cur_scale, 1.0);
        draw(gl, u_xformMatraix, modelMatrix);   //绘制新三角形
        rid = requestAnimationFrame(tick, canvas); //请求动画
    }
    tick();
    document.onkeydown = function (ev) {
        if (ev.key === 't') { //key T  ev.keyCode === 84
            if (isRotating) {
                window.cancelAnimationFrame(rid); //停止动画
            } else {
                g_last = Date.now();
                tick();               //继续动画
            }
            isRotating = !isRotating;
        }
    }
}

function initVertex(gl, a_Position) {
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    let vertexes = new Float32Array([
        -0.25, 0,
        0, 0.5,
        0.25, 0
    ])
    gl.bufferData(gl.ARRAY_BUFFER, vertexes, gl.STATIC_DRAW);
    //建立着色器中变量与缓冲区数据的连接
    gl.enableVertexAttribArray(a_Position);
    //size 维度， normalized ， stride 每次迭代前进大小， offset 起始读取位置的偏移量
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
}

function draw(gl, u_xformMatraix, modelMatrix) {
    //清除画布
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniformMatrix4fv(u_xformMatraix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

let g_last = Date.now();

function animate(angle, scale) {
    //计算两次调用函数的时间间隔
    let now = Date.now();
    let elapsed = now - g_last;
    g_last = now;
    //计算新角度和大小
    let newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    let newScale = scale;
    newAngle %= 360;
    if (newAngle <= 180) {
        newScale = scale - (SCALE_STEP * elapsed) / 1000.0;
    } else {
        newScale = scale + (SCALE_STEP * elapsed) / 1000.0;
    }
    return [newAngle, newScale];
}


