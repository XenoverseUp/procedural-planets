import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  FrontSide,
  Mesh,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
  Vector2,
  Vector3,
} from "three";
import { useAtom, useAtomValue } from "jotai";
import { noiseFiltersAtom } from "@/atoms/settings";
import generateTerrain from "./mesh-generation";
import CustomShaderMaterial from "three-custom-shader-material";

import vs from "@/glsl/planet.vs?raw";
import fs from "@/glsl/planet.fs?raw";
import MinMax from "@/lib/min-max";
import { extend } from "@react-three/fiber";
import { maximumAtom, minimumAtom } from "@/atoms/minMax";

extend({ CustomShaderMaterial });

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

  const [minimum, setMinimum] = useAtom(minimumAtom);
  const [maximum, setMaximum] = useAtom(maximumAtom);

  useLayoutEffect(() => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uRadius = {
      value: radius,
    };

    shaderRef.current.uniforms.uMinMax = {
      value: [minimum, maximum],
    };
  }, [radius, minimum, maximum]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    const { vertices, indices, elevationMinMax } = generateTerrain({
      resolution,
      localUp,
      noiseFilters,
    });

    setMinimum(elevationMinMax.min);
    setMaximum(elevationMinMax.max);

    meshRef.current.clear();

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(vertices, 3));
    geometry.setIndex(new BufferAttribute(indices, 1));

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
      {/* <shaderMaterial
        {...{ wireframe }}
        lights
        uniforms={UniformsUtils.merge([UniformsLib["lights"]])}
        ref={shaderRef}
        vertexShader={vs}
        fragmentShader={fs}
      /> */}

      <CustomShaderMaterial
        ref={shaderRef}
        vertexShader={vs}
        fragmentShader={fs}
        {...{ wireframe }}
        baseMaterial={MeshPhongMaterial}
        shininess={200}
      />
      {/* <meshPhongMaterial
        specular="white"
        color="#fd6899"
        shininess={3}
        {...{ wireframe }}
        side={renderBackface ? DoubleSide : FrontSide}
      /> */}
      {/* <meshPhysicalMaterial color="#fd6899" specularIntensity={20} /> */}
      {/* <meshToonMaterial color="lightblue" /> */}
      {/* <meshNormalMaterial
        {...{ wireframe }}
        side={renderBackface ? DoubleSide : FrontSide}
      /> */}
    </mesh>
  );
};

export default TerrainFace;
