import { useAtom, useAtomValue } from "jotai";
import { useLayoutEffect, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Camera,
  DoubleSide,
  FrontSide,
  Mesh,
  MeshPhysicalMaterial,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Uniform,
  Vector2,
  Vector3,
  Vector4,
} from "three";
import CustomShaderMaterial from "three-custom-shader-material";

import {
  depthGradientAtom,
  elevationGradientAtom,
  noiseFiltersAtom,
} from "@/atoms/settings";

import { maximumAtom, minimumAtom } from "@/atoms/minMax";
import { extend, useFrame, useThree } from "@react-three/fiber";

import planetFragment from "@/glsl/planet/planet.fs?raw";
import planetVertex from "@/glsl/planet/planet.vs?raw";

import vertexComputeShader from "@/glsl/compute/vertex-compute.fs?raw";

import {
  createComputeMaterial,
  createRenderTarget,
  readData,
} from "@/lib/gpu-compute";

extend({ CustomShaderMaterial });

const MAX_GRADIENT_SIZE: GLuint = 10;

type TerrainFaceProps = {
  resolution: number;
  localUp: Vector3;
  wireframe?: boolean;
  radius?: number;
  renderBackface?: boolean;
  isBlend?: boolean;
};

const TerrainFace = ({
  resolution,
  localUp,
  wireframe,
  radius = 1,
  isBlend = false,
  renderBackface = false,
}: TerrainFaceProps) => {
  const meshRef = useRef<Mesh>(null);
  const shaderRef = useRef<ShaderMaterial>(null);

  const noiseFilters = useAtomValue(noiseFiltersAtom);
  const elevationGradient = useAtomValue(elevationGradientAtom);
  const depthGradient = useAtomValue(depthGradientAtom);

  const [minimum, setMinimum] = useAtom(minimumAtom);
  const [maximum, setMaximum] = useAtom(maximumAtom);

  useFrame(({ clock }) => {
    if (!shaderRef.current) return;

    shaderRef.current.uniforms.uTime = new Uniform(clock.getElapsedTime());
  });

  useLayoutEffect(() => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uRadius = new Uniform(radius);

    shaderRef.current.uniforms.uIsBlend = new Uniform(isBlend);

    shaderRef.current.uniforms.uMinMax = new Uniform(
      new Vector2(minimum, maximum),
    );

    shaderRef.current.uniforms.uElevationGradientSize = new Uniform(
      elevationGradient.length,
    );

    shaderRef.current.uniforms.uDepthGradientSize = new Uniform(
      depthGradient.length,
    );

    shaderRef.current.uniforms.uElevationGradient = new Uniform([
      ...elevationGradient,
      ...new Array(MAX_GRADIENT_SIZE - elevationGradient.length)
        .fill(null)
        .map(() => ({
          anchor: 0,
          color: new Vector4(0),
        })),
    ]);

    shaderRef.current.uniforms.uDepthGradient = new Uniform([
      ...depthGradient,
      ...new Array(MAX_GRADIENT_SIZE - depthGradient.length)
        .fill(null)
        .map(() => ({
          anchor: 0,
          color: new Vector4(0),
        })),
    ]);
  }, [
    radius,
    elevationGradient,
    depthGradient,
    minimum,
    maximum,
    noiseFilters,
    isBlend,
  ]);

  const { gl } = useThree();

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    const vertexRenderTarget = createRenderTarget(resolution);

    const vertexMaterial = createComputeMaterial(
      vertexComputeShader,
      Math.floor(resolution),
      localUp,
    );
    const quad = new Mesh(new PlaneGeometry(2, 2), vertexMaterial);
    const scene = new Scene();
    scene.add(quad);

    const camera = new Camera();
    gl.setRenderTarget(vertexRenderTarget);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    const vertexData = readData(gl, vertexRenderTarget, resolution, 4);

    const positions = new Float32Array(resolution ** 2 * 3);
    for (let i = 0; i < resolution ** 2; i++) {
      positions[i * 3 + 0] = vertexData[i * 4 + 0];
      positions[i * 3 + 1] = vertexData[i * 4 + 1];
      positions[i * 3 + 2] = vertexData[i * 4 + 2];
    }

    const indices = [];
    for (let y = 0; y < resolution - 1; y++) {
      for (let x = 0; x < resolution - 1; x++) {
        const i = x + y * resolution;
        indices.push(i, i + 1, i + resolution + 1);
        indices.push(i, i + resolution + 1, i + resolution);
      }
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setIndex(indices);

    meshRef.current.clear();

    geometry.attributes.position.needsUpdate = true;

    geometry.computeVertexNormals();

    if (meshRef.current) {
      const oldGeometry = meshRef.current.geometry;
      meshRef.current.geometry = geometry;
      if (oldGeometry) oldGeometry.dispose();
    }

    return () => {
      geometry.dispose();
      meshRef.current?.geometry.dispose();
    };
  }, [resolution, localUp]);

  return (
    <>
      <mesh castShadow receiveShadow ref={meshRef}>
        <bufferGeometry />
        <CustomShaderMaterial
          ref={shaderRef}
          vertexShader={planetVertex}
          fragmentShader={planetFragment}
          baseMaterial={MeshPhysicalMaterial}
          {...{ wireframe }}
          side={renderBackface ? DoubleSide : FrontSide}
        />
      </mesh>
    </>
  );
};

export default TerrainFace;
