import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  FrontSide,
  Mesh,
  MeshPhongMaterial,
  ShaderMaterial,
  Uniform,
  Vector2,
  Vector3,
  Vector4,
} from "three";
import { useAtom, useAtomValue } from "jotai";
import { elevationGradientAtom, noiseFiltersAtom } from "@/atoms/settings";
import MeshGenerator from "./mesh-generation";
import CustomShaderMaterial from "three-custom-shader-material";

import vs from "@/glsl/planet.vs?raw";
import fs from "@/glsl/planet.fs?raw";
import { extend, useFrame } from "@react-three/fiber";
import { maximumAtom, minimumAtom } from "@/atoms/minMax";

extend({ CustomShaderMaterial });

const MAX_GRADIENT_SIZE: GLuint = 10;

type TerrainFaceProps = {
  resolution: number;
  localUp: Vector3;
  wireframe?: boolean;
  radius?: number;
  renderBackface?: boolean;
};

const TerrainFace = ({
  resolution,
  localUp,
  wireframe,
  radius = 1,
  renderBackface = false,
}: TerrainFaceProps) => {
  const meshRef = useRef<Mesh>(null);
  const shaderRef = useRef<ShaderMaterial>(null);
  const noiseFilters = useAtomValue(noiseFiltersAtom);
  const elevationGradient = useAtomValue(elevationGradientAtom);

  const [minimum, setMinimum] = useAtom(minimumAtom);
  const [maximum, setMaximum] = useAtom(maximumAtom);

  const meshGenerator = useRef(
    new MeshGenerator({
      resolution,
      localUp,
      noiseFilters,
    }),
  );

  useLayoutEffect(() => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uRadius = new Uniform(radius);

    shaderRef.current.uniforms.uMinMax = new Uniform(
      new Vector2(minimum, maximum),
    );

    shaderRef.current.uniforms.uGradientSize = new Uniform(
      elevationGradient.length,
    );

    shaderRef.current.uniforms.uGradient = new Uniform([
      ...elevationGradient,
      ...new Array(MAX_GRADIENT_SIZE - elevationGradient.length)
        .fill(null)
        .map(() => ({
          anchor: 0,
          color: new Vector4(0),
        })),
    ]);

    // console.log(shaderRef.current.uniforms);
  }, [radius, minimum, maximum, elevationGradient]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    meshGenerator.current.resolution = resolution;
    meshGenerator.current.localUp = localUp;
    meshGenerator.current.noiseFilters = noiseFilters;

    const geometry = new BufferGeometry();

    const { vertices, indices, elevationMinMax, uv } =
      meshGenerator.current.generateTerrain();

    setMinimum((value) => Math.min(value, elevationMinMax.min));
    setMaximum((value) => Math.max(value, elevationMinMax.max));

    meshRef.current.clear();

    geometry.setAttribute("uv", new BufferAttribute(uv, 2));
    geometry.setAttribute("position", new BufferAttribute(vertices, 3));
    geometry.setIndex(new BufferAttribute(indices, 1));

    geometry.attributes.uv.needsUpdate = true;
    geometry.attributes.position.needsUpdate = true;

    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();

    if (meshRef.current) {
      const oldGeometry = meshRef.current.geometry;
      meshRef.current.geometry = geometry;
      if (oldGeometry) oldGeometry.dispose();
    }

    return () => {
      geometry.dispose();
      meshRef.current?.geometry.dispose();
    };
  }, [resolution, localUp, noiseFilters]);

  return (
    <mesh ref={meshRef}>
      <bufferGeometry />
      <CustomShaderMaterial
        ref={shaderRef}
        vertexShader={vs}
        fragmentShader={fs}
        {...{ wireframe }}
        baseMaterial={MeshPhongMaterial}
        shininess={200}
        side={renderBackface ? DoubleSide : FrontSide}
      />
    </mesh>
  );
};

export default TerrainFace;
