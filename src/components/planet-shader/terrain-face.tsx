import { useEffect, useLayoutEffect, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  FrontSide,
  Mesh,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three";
import { useAtomValue } from "jotai";
import { noiseFiltersAtom } from "@/atoms/settings";
import generateTerrain from "./mesh-generation";
import vs from "@/glsl/terrain.vs?raw";
import fs from "@/glsl/terrain.fs?raw";
import { useFrame } from "@react-three/fiber";

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

  useLayoutEffect(() => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uRadius = {
      value: radius,
    };
  }, [radius]);

  useEffect(() => {
    if (!meshRef.current) return;

    const { vertices, indices } = generateTerrain({
      resolution,
      radius,
      localUp,
      noiseFilters,
    });

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
      <shaderMaterial ref={shaderRef} vertexShader={vs} fragmentShader={fs} />
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
