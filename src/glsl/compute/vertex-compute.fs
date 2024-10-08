precision highp float;

const int MAX_FILTER_COUNT = 3;

struct noiseFilter {
    bool  enabled;
    float strength;
    float roughness;
    vec3  center;
    float baseRoughness;
    float persistence;
    float minValue;
    int   layerCount;
    bool  useFirstLayerAsMask;
    int   filterType;
};

uniform int uResolution;
uniform vec3 uLocalUp;
uniform noiseFilter uFilters[MAX_FILTER_COUNT];
uniform int uFilterLength;
uniform float uSeed;

vec4 permute(vec4 x, float seed) {
    return mod(((x*34.0)+1.0 + seed)*x, 289.0);
}

vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

vec3 fade(vec3 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec3 P, float seed) {
    vec3 Pi0 = floor(P);
    vec3 Pi1 = Pi0 + vec3(1.0);
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P);
    vec3 Pf1 = Pf0 - vec3(1.0);
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix, seed) + iy, seed);
    vec4 ixy0 = permute(ixy + iz0, seed);
    vec4 ixy1 = permute(ixy + iz1, seed);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);

    return 2.2 * n_xyz;
}

float ridgidNoise(vec3 point, float seed) {
    float v = cnoise(point, seed);
    v = abs(v);
    v = 1.0 - v;
    v = pow(v, 2.0);

    return v;
}

float evaluateSimpleNoiseFilter(vec3 point, noiseFilter nfilter, float seed) {
    float noiseValue = 0.0;
    float frequency = nfilter.baseRoughness;
    float amplitude = 1.0;

    for (int i = 0; i < nfilter.layerCount; i++) {
        vec3 pp = point * frequency + nfilter.center;
        noiseValue += (cnoise(pp, seed) + 1.) * 0.5 * amplitude;
        frequency *= nfilter.roughness;
        amplitude *= nfilter.persistence;
    }

    noiseValue = max(0.0, noiseValue - nfilter.minValue);

    return noiseValue * nfilter.strength;
}

float evaluateUnscaledSimpleNoiseFilter(vec3 point, noiseFilter nfilter, float seed) {
    float noiseValue = 0.0;
    float frequency = nfilter.baseRoughness;
    float amplitude = 1.0;

    for (int i = 0; i < nfilter.layerCount; i++) {
        vec3 pp = point * frequency + nfilter.center;
        noiseValue += (cnoise(pp, seed) + 1.) * 0.5 * amplitude;
        frequency *= nfilter.roughness;
        amplitude *= nfilter.persistence;
    }

    noiseValue -= nfilter.minValue;

    return noiseValue * nfilter.strength;
}

float evaluateRidgidNoiseFilter(vec3 point, noiseFilter nfilter, float seed) {
    float noiseValue = 0.0;
    float frequency = nfilter.baseRoughness;
    float amplitude = 1.0;
    float weight = 2.0;

    for (int i = 0; i < nfilter.layerCount; i++) {
        vec3 pp = point * frequency + nfilter.center;

        float v = (ridgidNoise(pp, seed) + 1.) * 0.5 * amplitude;
        v *= weight;
        weight = v;

        noiseValue += v * amplitude;
        frequency *= nfilter.roughness;
        amplitude *= nfilter.persistence;
    }

    noiseValue = max(0.0, noiseValue - nfilter.minValue);

    return noiseValue * nfilter.strength;
}

float evaluateUnscaledRidgidNoiseFilter(vec3 point, noiseFilter nfilter, float seed) {
    float noiseValue = 0.0;
    float frequency = nfilter.baseRoughness;
    float amplitude = 1.0;
    float weight = 2.0;

    for (int i = 0; i < nfilter.layerCount; i++) {
        vec3 pp = point * frequency + nfilter.center;

        float v = ridgidNoise(pp, seed);
        v *= weight;
        weight = v;

        noiseValue += v * amplitude;
        frequency *= nfilter.roughness;
        amplitude *= nfilter.persistence;
    }

    noiseValue -= nfilter.minValue;

    return noiseValue * nfilter.strength;
}

float evaluateNoiseFilter(vec3 point, noiseFilter nfilter, float seed) {
    if (nfilter.filterType == 0) return evaluateSimpleNoiseFilter(point, nfilter, seed);
    return evaluateRidgidNoiseFilter(point, nfilter, seed);
}

float evaluateUnscaledNoiseFilter(vec3 point, noiseFilter nfilter, float seed) {
    if (nfilter.filterType == 0) return evaluateUnscaledSimpleNoiseFilter(point, nfilter, seed);
    return evaluateUnscaledRidgidNoiseFilter(point, nfilter, seed);
}

float calculateUnscaledElevation(vec3 point, float seed) {
    float elevation = 0.0;
    float mask = max(0.0, evaluateNoiseFilter(point, uFilters[0], seed));

    bool depthCaptured = false;

    for (int i = 0; i < uFilterLength; i++) {
        noiseFilter nfilter = uFilters[i];

        if (!nfilter.enabled) continue;

        float noiseValue = evaluateUnscaledNoiseFilter(point, nfilter, seed);

        if (nfilter.useFirstLayerAsMask) noiseValue *= mask * 10.0;

        elevation += depthCaptured ? max(0.0, noiseValue): noiseValue;

        if (!depthCaptured) depthCaptured = true;
    }

    return elevation;
}

float getScaledElevation(float unscaledElevation) {
    return max(0.0, unscaledElevation);
}

void main() {
    float resolution = float(uResolution);
    vec3 axisA = uLocalUp.yzx;
    vec3 axisB = cross(uLocalUp, axisA);

    vec2 uv = gl_FragCoord.xy / resolution;

    vec3 pointOnCube = uLocalUp * (1.0 - 1.0 / resolution) + axisA * (uv.x - 0.5) * 2.0 + axisB * (uv.y - 0.5) * 2.0;
    vec3 pointOnUnitSphere = normalize(pointOnCube);

    float unscaledElevation = calculateUnscaledElevation(pointOnUnitSphere, uSeed);
    float elevation = getScaledElevation(unscaledElevation);

    gl_FragColor = vec4(pointOnUnitSphere * (1.0 + elevation), 1.0 + unscaledElevation);
}
