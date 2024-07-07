precision mediump float;

uniform float uRadius;

varying vec3 vPosition;


void main() {
    vPosition = position;
    csm_Position = position * uRadius;
}