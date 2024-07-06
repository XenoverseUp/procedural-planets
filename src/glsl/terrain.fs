precision mediump float;

uniform float uRadius;

varying vec3 vNormal;

void main() {
    gl_FragColor = vec4(vNormal, 1);
}