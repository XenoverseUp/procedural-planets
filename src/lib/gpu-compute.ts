import { Vector3 } from "@react-three/fiber";
import {
  FloatType,
  NearestFilter,
  RGBAFormat,
  ShaderMaterial,
  Uniform,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";

import bufferVertex from "@/glsl/compute/buffer.vs?raw";

export const createComputeMaterial = (
  fragmentShader: string,
  resolution: GLuint,
  uniforms?: Record<string, Uniform>,
) =>
  new ShaderMaterial({
    uniforms: {
      uResolution: new Uniform(resolution),
      ...uniforms,
    },
    vertexShader: bufferVertex,
    fragmentShader,
  });

export const createRenderTarget = (resolution: number) =>
  new WebGLRenderTarget(resolution, resolution, {
    type: FloatType,
    format: RGBAFormat,
    minFilter: NearestFilter,
    magFilter: NearestFilter,
  });

export const readData = (
  gl: WebGLRenderer,
  renderTarget: WebGLRenderTarget,
  size: number,
  componentSize: number,
) => {
  const readBuffer = new Float32Array(size * size * componentSize);
  gl.readRenderTargetPixels(renderTarget, 0, 0, size, size, readBuffer);
  return readBuffer;
};
