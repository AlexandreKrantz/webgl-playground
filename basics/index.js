const vertexShaderSource = `#version 300 es
in float aPointSize;
in vec2 aPosition;
in float aIndex;
out float vIndex;

void main()
{
    vIndex = aIndex;
    gl_PointSize = aPointSize;
    gl_Position = vec4(aPosition, 0.1, 1.0);
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
out vec4 fragColor;
in float vIndex;
uniform vec4 uColor[3];

void main()
{
    fragColor = uColor[ int(vIndex) ];
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
const uPointSizeLocation = gl.getUniformLocation(program, 'uPointSize');
gl.uniform1f(uPointSizeLocation, 20.0);
const uPositionLocation = gl.getUniformLocation(program, 'uPosition');
gl.uniform2f(uPositionLocation, 0, 0.3);
const colorsArr = [
    1,0,0,1, // red
    0,1,0,1, // green
    0,0,1,1  // blue
];
const uColorLocation = gl.getUniformLocation(program, 'uColor');
gl.uniform4fv(uColorLocation, colorsArr); // 4fv because it's a vec4 float array
const uIndexLocation = gl.getUniformLocation(program, 'uIndex');
gl.uniform1i(uIndexLocation, 2);
// END set uniforms

// START set attributes
// x, y, size, colorsArr index
// x and y should be between 1 and -1
const bufferData = new Float32Array([
    0,0,        100, 0, 
    0.5,-0.8,   32, 1,
    -0.9,0.5,   50, 2
]);

const aPointSizeLoc = gl.getAttribLocation(program, 'aPointSize'); 
const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
const aIndexLoc = gl.getAttribLocation(program, 'aIndex');

gl.enableVertexAttribArray(aPointSizeLoc);
gl.enableVertexAttribArray(aPositionLoc);
gl.enableVertexAttribArray(aIndexLoc);

const buffer = gl.createBuffer(); // buffer to pass in the attribute data
gl.bindBuffer(gl.ARRAY_BUFFER, buffer); // create a new buffer and bind it to the ARRAY_BUFFER pointer of the program
gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW) // STATIC_DRAW means that the bufferData won't be changing

// tells webgl how to read the buffer to get the data that the shader expects
gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 4*4, 0);
gl.vertexAttribPointer(aPointSizeLoc, 1, gl.FLOAT, false, 4*4, 2*4);
gl.vertexAttribPointer(aIndexLoc, 1, gl.FLOAT, false, 4*4, 3*4);



gl.drawArrays(gl.LINE_LOOP, 0, 3);
