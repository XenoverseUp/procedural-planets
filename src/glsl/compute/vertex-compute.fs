precision highp float;

uniform int uResolution;
uniform vec3 uLocalUp;

varying vec3 vPosition;

void main() {
    float resolution = float(uResolution);
    vec3 axisA = uLocalUp.yzx;
    vec3 axisB = cross(uLocalUp, axisA);

    vec2 uv = (gl_FragCoord.xy) / resolution ;
    float x = floor(uv.x * (resolution - 1.0));
    float y = floor(uv.y * (resolution - 1.0));

    vec3 pointOnCube = uLocalUp * (1.0 - 1.0 / resolution) + axisA * (uv.x - 0.5) * 2.0 + axisB * (uv.y - 0.5) * 2.0;
    vec3 pointOnUnitSphere = normalize(pointOnCube);

    // Apply noise filters here if needed

    gl_FragColor = vec4(pointOnUnitSphere, 1.0);
}
