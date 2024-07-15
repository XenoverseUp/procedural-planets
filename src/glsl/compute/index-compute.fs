precision highp float;

uniform float uResolution;

void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    float x = uv.x * (uResolution - 1.0);
    float y = uv.y * (uResolution - 1.0);

    int i = int(x + y * uResolution);

    int indices[6];

    if (x < uResolution - 1.0 && y < uResolution - 1.0) {
        int baseIndex = i;
        indices[0] = baseIndex + int(uResolution) + 1;
        indices[1] = baseIndex + 1;
        indices[2] = baseIndex;
        indices[3] = baseIndex + int(uResolution);
        indices[4] = baseIndex + int(uResolution) + 1;
        indices[5] = baseIndex;
    } else {
        indices[0] = -1;
        indices[1] = -1;
        indices[2] = -1;
        indices[3] = -1;
        indices[4] = -1;
        indices[5] = -1;
    }

    gl_FragColor = vec4(indices[0], indices[1], indices[2], indices[3]);
}
