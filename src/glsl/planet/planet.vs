precision mediump float;

uniform float uRadius;
uniform float uTime;



varying vec3 vPosition;
varying vec2 vUv;


void main() {
    vPosition = position;
    vUv = uv;
    vNormal = normal;

    csm_Position = position * uRadius;
}
