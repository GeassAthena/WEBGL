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
    initTexture(gl, n);
}

function initVertexBuffer(gl) {
    let vertices = new Float32Array([
        -0.5, 0.5, 0.0, 1.0,
        -0.5, -0.5, 0.0, 0.0,
        0.5, 0.5, 1.0, 1.0,
        0.5, -0.5, 1.0, 0.0
    ]);
    let n = 4;
    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let FSIZE = vertices.BYTES_PER_ELEMENT;
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, FSIZE * 4, 0);
    gl.enableVertexAttribArray(a_Position);

    let a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
    gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 4, FSIZE * 2);
    gl.enableVertexAttribArray(a_TexCoord);

    return n;
}
//多重纹理加载，创建纹理对象
function initTexture(gl, n) {
    let texture = gl.createTexture();
    let texture1 = gl.createTexture();
    let u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler');
    let u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');

    let image = new Image();
    let image1 = new Image();

    //异步事件在图片加载完后进行纹理配置
    image.onload = function () {
        loadTexture(gl, n, texture, u_Sampler, image, 0);
    }
    image1.onload = function () {
        loadTexture(gl, n, texture1, u_Sampler1, image1, 1);
    }
    image.src = "bird.jpg";
    image1.src = "sky.jpg";
}


let loader = 0;//记录纹理加载数目
function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
    loader++;
    //对纹理图像进行y轴反转
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    //开启纹理
    gl.activeTexture(gl[`TEXTURE${texUnit}`]);
    //绑定纹理对象
    gl.bindTexture(gl.TEXTURE_2D, texture);
    //配置纹理参数
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //配置纹理图像
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    //将纹理传给着色器
    gl.uniform1i(u_Sampler, texUnit);
    if (loader === 2) {
        //绘制
        gl.clearColor(0.0, 0.0, 0.0, 1.0)
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
    }
}