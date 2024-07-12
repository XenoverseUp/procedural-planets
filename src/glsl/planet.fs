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
    if (minimum == maximum) return 1.0;
    if (value == maximum) return 1.0;
    if (value == minimum) return 0.0;
    return (value - minimum) / (maximum - minimum);
}

// Improve and add fixed and blend gradient.
vec4 findHeightColor(float elevationRate) {
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

vec4 findDepthColor(float depthRate) {
    return mix(vec4(0, 0, 0.4, 1), vec4(0.15, 0.55, 1, 1), depthRate);
}


void main() {
    float elevation = 1.0 + vUv.x;
    vec4 color = vec4(0, 0, 1, 1);

    if (elevation > 1.01) {
        float elevationRate = inverseLerp(1.01, uMinMax.y, elevation);
        color = findHeightColor(elevationRate);

        csm_Metalness = 0.0;
        csm_Roughness = 0.4;

    } else if (elevation >= 1.0 && elevation <= 1.01) {
    float elevationRate = inverseLerp(1.01, uMinMax.y, elevation);
        float depthRate = inverseLerp(uMinMax.x, 1.00, elevation);

        float t = smoothstep(1.0, 1.01, elevation);

        csm_Metalness = 0.4 * (1.0 - t);
        csm_Roughness = 0.4 * t;

        color = mix(findDepthColor(depthRate), findHeightColor(elevationRate), t);

    } else {
        float depthRate = inverseLerp(uMinMax.x, 1.00, elevation);
        color = findDepthColor(depthRate);

        csm_Roughness = 0.0;
        csm_Metalness = 0.4 * (1.0 - vUv.x);

    }




    csm_DiffuseColor = color;
}
