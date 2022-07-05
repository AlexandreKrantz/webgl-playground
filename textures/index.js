const vertexShaderSource = `#version 300 es
layout(location=0) in vec2 aPosition;
layout(location=1) in vec2 aTexCoord;
out vec2 vTexCoord;

void main()
{
    vTexCoord = aTexCoord;
    gl_Position = vec4(aPosition, 0.1, 1.0);
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
out vec4 fragColor;

in vec2 vTexCoord;
uniform sampler2D uSampler;

void main()
{
    fragColor = texture(uSampler, vTexCoord);
}`;

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');
const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

// gl.LINK_STATUS is false when the program fails to link
if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
}

gl.useProgram(program);

// START set uniforms

// END set uniforms

// START set attributes
const bufferData = new Float32Array([
    -1, -1, 1, -1, 1, 1,
    1, 1, -1, -1, -1, 1,

]);
const aPositionLoc = 0;
gl.enableVertexAttribArray(aPositionLoc);
const buffer = gl.createBuffer(); // buffer to pass in the attribute data
gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // create a new buffer and bind it to the ARRAY_BUFFER pointer of the program
gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW) // STATIC_DRAW means that the bufferData won't be changing
gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 2 * 4, 0); // tells webgl how to read the buffer to get the data that the shader expects

const bufferData2 = new Float32Array([0, 0, 1, 0, 1, 1,
    1, 1, 0, 0, 0, 1,])
const aTexCoordLoc = 1;
gl.enableVertexAttribArray(aTexCoordLoc);
const buffer2 = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
gl.bufferData(gl.ARRAY_BUFFER, bufferData2, gl.STATIC_DRAW);
gl.vertexAttribPointer(aTexCoordLoc, 2, gl.FLOAT, false, 0, 0);

// texture stuff; pixels = random rgb values
const pixelArr = new Uint8Array([
    255, 255, 255, 230, 25, 75, 60, 180, 75, 255, 225, 25,
    67, 99, 216, 245, 130, 49, 145, 30, 180, 70, 240, 240,
    240, 50, 230, 188, 246, 12, 250, 190, 190, 0, 128, 128,
    230, 190, 255, 154, 99, 36, 255, 250, 200, 0, 0, 0,
]);

/*
const pixelBuffer = gl.createBuffer();
gl.bindBuffer(gl.PIXEL_UNPACK_BUFFER, pixelBuffer);
gl.bufferData(gl.PIXEL_UNPACK_BUFFER, pixelArr, gl.STATIC_DRAW);
*/
const loadImage = () => new Promise((res) => {
    const image = new Image();
    image.addEventListener('load', () => res(image));
    image.src = './cute.jpg'
})

async function imageStuff() {
    const image = await loadImage();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const alignment = 1;
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // START data texture
    // fill texture with 3x2 pixels
    const level = 0;
    const internalFormat = gl.LUMINANCE;
    const width = 3;
    const height = 2;
    const border = 0;
    const format = gl.LUMINANCE;
    const type = gl.UNSIGNED_BYTE;
    const data = new Uint8Array([
        128, 64, 128,
        0, 192, 0,
    ]);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border,
        format, type, data);

    // set the filtering so we don't need mips and it's not filtered
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // END data texture

    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 4, 4, 0, gl.RGB, gl.UNSIGNED_BYTE, pixelArr);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 256, 256, 0, gl.RGB, gl.UNSIGNED_BYTE, 0) // last param is pixelBuffer offset
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    // ^ the 3rd param (gl.RGB) is the internalFormat. Used to describe the textures of the final shader (used by fragment shader)
    // second gl.RGB param is the format of the source data. 
    // last param is the source. It can either be an HTML element or a TypedArray, or a pixel buffer.

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
}
imageStuff();