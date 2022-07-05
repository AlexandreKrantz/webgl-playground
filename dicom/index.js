import {render} from './webgl.js'

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('webgl2');
const pixelData = new Uint8Array([
    128, 64, 128,
    0, 192, 0,
]);

render(pixelData, ctx);