const VSHADER_SOURCE = document.getElementById('vertex-shader').textContent;
const FSHADER_SOURCE = document.getElementById('fragment-shader').textContent;


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
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

function initVertexBuffer(gl) {
    let vertices = new Float32Array([
        -0.5, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, 0.5, 0.0, 0.0, 1.0,
        0.5, -0.5, 0.0, 0.0, 0.0
    ]);
    let n = 4;
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let FSIZE = vertices.BYTES_PER_ELEMENT;
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 5, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 5, FSIZE * 2);
    gl.enableVertexAttribArray(a_Color);

    return n;
}