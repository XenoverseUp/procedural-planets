precision mediump float;

uniform float uRadius;


varying vec3 vPosition;
varying vec2 vUv;


void main() {
    vPosition = position;
    vUv = uv;
    csm_Position = position * uRadius;
}
