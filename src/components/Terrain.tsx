import { useLayoutEffect, useRef } from "react";
import { BufferGeometry, Mesh } from "three";
import { createNoise3D } from "simplex-noise";
import { useAtomValue } from "jotai";
import { firstLayerAtom } from "../atoms/settings";
import { shaderMaterial } from "@react-three/drei";
import { fragmentShader, vertexShader } from "../shaders/terrain";
import { extend, useFrame } from "@react-three/fiber";

const TerrainMaterial = shaderMaterial(
  {
    uAmplitude: 1,
  },
  vertexShader,
  fragmentShader,
);

extend({ TerrainMaterial });

function Terrain() {
  const meshRef = useRef<Mesh>(null);
  const noise = createNoise3D();
  const firstLayer = useAtomValue(firstLayerAtom);

  useFrame((state) => {
    if (meshRef.current) {
      (meshRef.current.material as any).uniforms.uAmplitude.value =
        firstLayer.amplitude;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 64, 64]} />
      {/* <meshStandardMaterial color="lightgreen" /> */}
      <terrainMaterial attach="material" color="lightgreen" />
    </mesh>
  );
}

export default Terrain;
