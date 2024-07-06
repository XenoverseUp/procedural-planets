uniform float radius;


void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * radius, 1.0);
}