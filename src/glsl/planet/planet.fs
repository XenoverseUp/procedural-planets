precision mediump float;

const int MAX_GRADIENT_SIZE = 10;

struct gradientStop  {
    float anchor;
    vec4 color;
};

uniform float uRadius;
uniform vec2 uMinMax;
uniform bool uIsBlend;
uniform int uElevationGradientSize;
uniform int uDepthGradientSize;
uniform gradientStop uElevationGradient[MAX_GRADIENT_SIZE];
uniform gradientStop uDepthGradient[MAX_GRADIENT_SIZE];

varying vec3 vPosition;
varying vec2 vUv;


float harshstep(float min, float max, float value) {
    float avg = (min + max) / 2.0;

    if (value >= avg) return 1.0;
    else return 0.0;
}

float inverseLerp(float minimum, float maximum, float value) {
    if (minimum == maximum) return 1.0;
    if (value == maximum) return 1.0;
    if (value == minimum) return 0.0;
    return (value - minimum) / (maximum - minimum);
}

// Improve and add fixed and blend gradient.
vec4 findHeightColor(float elevationRate) {
    if (elevationRate >= uElevationGradient[uElevationGradientSize - 1].anchor) return uElevationGradient[uElevationGradientSize - 1].color;

    vec4 color = uElevationGradient[0].color;

    for (int i = 1; i < uElevationGradientSize; i++) {
        if (elevationRate <= uElevationGradient[i].anchor) {

            if (uIsBlend) {
                float t = smoothstep(uElevationGradient[i - 1].anchor, uElevationGradient[i].anchor, elevationRate);
                color = mix(uElevationGradient[i - 1].color, uElevationGradient[i].color, t);
                break;
            }

            float t = harshstep(uElevationGradient[i - 1].anchor, uElevationGradient[i].anchor, elevationRate);
            color = mix(uElevationGradient[i - 1].color, uElevationGradient[i].color, t);

            break;
        }
    }
    return color;
}

vec4 findDepthColor(float depthRate) {
    if (depthRate >= uDepthGradient[uDepthGradientSize - 1].anchor) return uDepthGradient[uDepthGradientSize - 1].color;

    vec4 color = uDepthGradient[0].color;

    for (int i = 1; i < uDepthGradientSize; i++) {
        if (depthRate <= uDepthGradient[i].anchor) {
            float t = smoothstep(uDepthGradient[i - 1].anchor, uDepthGradient[i].anchor, depthRate);
            color = mix(uDepthGradient[i - 1].color, uDepthGradient[i].color, t);
        }
    }
    return color;
}


void main() {
    const float mixRange = 0.005;

    float elevation = vUv.x;
    vec4 color = vec4(0, 0, 1, 1);

    if (elevation > 1.0 + mixRange) {
        float elevationRate = inverseLerp(1.0 + mixRange, uMinMax.y, elevation);
        color = findHeightColor(elevationRate);

        csm_Metalness = 0.0;
        csm_Roughness = 0.4;

    } else if (elevation >= 1.0 && elevation <= 1.0 + mixRange) {
        float elevationRate = inverseLerp(1.0 + mixRange, uMinMax.y, elevation);
        float depthRate = inverseLerp(uMinMax.x, 1.00, elevation);

        float t = smoothstep(1.0, 1.0 + mixRange, elevation);

        csm_Metalness = 0.4 * (1.0 - t);
        csm_Roughness = 0.4 * t;

        color = mix(findDepthColor(depthRate), findHeightColor(elevationRate), t);

    } else {
        float depthRate = inverseLerp(uMinMax.x, 1.00, elevation);
        color = findDepthColor(depthRate);

        csm_Roughness = 0.0;
        csm_Metalness = 0.4 * (2.0 - vUv.x);
    }




    csm_DiffuseColor = color;
}
