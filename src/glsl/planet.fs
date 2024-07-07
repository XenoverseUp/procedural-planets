precision mediump float;

uniform float uRadius;
uniform vec2 uMinMax;

varying vec3 vPosition;

struct gradient {
    float progress;
    vec4 color;
};


gradient[6] colorStops = gradient[6](
    gradient(0.0, vec4(0.15, 0.25, 1, 1)),
    gradient(0.06, vec4(0.639, 0.678, 0.237, 1)),
    gradient(0.126, vec4(0.235, 0.718, 0.0306, 1)),
    gradient(0.57, vec4(0.569, 0.357, 0.169, 1)),
    gradient(0.87, vec4(0.49, 0.318, 0.184, 1)),
    gradient(1.0, vec4(1, 1, 1, 1))
);

float inverseLerp(float minimum, float maximum, float value) {
    return (value - minimum) / (maximum - minimum);
}

vec4 findColor(float elevationRate) {
    vec4 color = colorStops[5].color;
    for (int i = 0; i < 5; i++) {
        if (elevationRate <= colorStops[i + 1].progress) {
            float t = inverseLerp(colorStops[i].progress, colorStops[i + 1].progress, elevationRate);
            color = mix(colorStops[i].color, colorStops[i + 1].color, t);
            break;
        }
    }
    return color;
}


void main() {
    float elevation = length(vPosition);
    float elevationRate = inverseLerp(uMinMax.x, uMinMax.y, elevation);


    vec4 color =  findColor(elevationRate);
    csm_DiffuseColor = color;
}