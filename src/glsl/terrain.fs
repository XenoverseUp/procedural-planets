precision mediump float;

uniform float uRadius;

varying vec3 vNormal;
varying float vElevation;

void main() {
    vec3 color = vec3(vNormal);
    gl_FragColor = vec4(color, 1);
}