precision mediump float;

uniform float uRadius;

varying vec3 vNormal;


void main() {
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * uRadius, 1.0);
}