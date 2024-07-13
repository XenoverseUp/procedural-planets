precision mediump float;

uniform float uRadius;
uniform float uTime;


varying vec3 vPosition;
varying vec2 vUv;


void main() {
    vPosition = position;
    vUv = uv;

    vec3 newPosition = position;

    // // Apply sine wave distortion to ocean areas (uv.x <= 0.0)
    // if (uv.x <= 0.01) {
    //     float wave = sin(position.x * 100.0 + uTime * 2.0) * 0.0075;
    //     newPosition += normal * wave;
    // }

      csm_Position = newPosition * uRadius;
}
