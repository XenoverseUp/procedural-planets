precision mediump float;

uniform float uRadius;
uniform float uTime;


varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vNormal;


void main() {
    vPosition = position;
    vUv = uv;
    vNormal = normal;

    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position * uRadius * 1.25, 1);
}
