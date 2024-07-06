precision mediump float;

uniform float uRadius;

varying vec3 vNormal;
varying vec3 vPosition;


void main() {
    vPosition = position;
    vNormal = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * uRadius, 1.0);
}