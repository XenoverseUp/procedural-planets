precision mediump float;

const int MAX_GRADIENT_SIZE = 10;

struct gradientStop  {
    float anchor;
    vec4 color;
};

uniform float uRadius;
uniform vec2 uMinMax;
uniform int uGradientSize;
uniform gradientStop uGradient[MAX_GRADIENT_SIZE];


varying vec3 vPosition;
varying vec2 vUv;


float inverseLerp(float minimum, float maximum, float value) {
    if (minimum == maximum) return 0.0;
    return (value - minimum) / (maximum - minimum);
}

vec4 findColor(float elevationRate) {
    vec4 color =  uGradient[0].color;

    for (int i = 0; i < uGradientSize - 1; i++) {
        if (elevationRate <= uGradient[i + 1].anchor) {
            float t = smoothstep(uGradient[i].anchor, uGradient[i + 1].anchor, elevationRate);
            color = mix(uGradient[i].color, uGradient[i + 1].color, t);
            break;
        }
    }
    return color;
}


void main() {
    float elevation = length(vPosition);
    float elevationRate = inverseLerp(uMinMax.x, uMinMax.y, elevation);

    vec4 color = findColor(elevationRate);
    csm_DiffuseColor = color;
}
