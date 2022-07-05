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

export {vertexShaderSource, fragmentShaderSource};