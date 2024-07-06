precision mediump float;

uniform float uRadius;
uniform vec2 uMinMax;

varying vec3 vNormal;
varying vec3 vPosition;


void main() {
    float elevation = length(vPosition);
    float elevationRate = smoothstep(uMinMax.y, uMinMax.x, elevation);

    vec3 color = vec3(elevationRate);
    gl_FragColor = vec4(color, 1);
}