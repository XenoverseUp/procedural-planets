import { useAtomValue } from "jotai";

import {
  isBlendAtom,
  isWireframeAtom,
  meshResolutionAtom,
  planetRadiusAtom,
  rendersGlobeAtom,
} from "@/atoms/settings";
import TerrainFace from "@/components/planet-gpu/terrain-face";
import WireFace from "@/components/planet/wire-face";
import {
  VECTOR_BACK,
  VECTOR_DOWN,
  VECTOR_FRONT,
  VECTOR_LEFT,
  VECTOR_RIGHT,
  VECTOR_UP,
} from "@/lib/vector";
import { forwardRef, useRef } from "react";
import { Mesh } from "three";
import { OrbitControls } from "@react-three/drei";

const directions = [
  VECTOR_UP,
  VECTOR_DOWN,
  VECTOR_LEFT,
  VECTOR_RIGHT,
  VECTOR_FRONT,
  VECTOR_BACK,
];

const PlanetGPU = forwardRef<Mesh>((_, ref) => {
  const resolution = useAtomValue(meshResolutionAtom);
  const wireframe = useAtomValue(isWireframeAtom);
  const radius = useAtomValue(planetRadiusAtom);
  const rendersGlobe = useAtomValue(rendersGlobeAtom);
  const isBlend = useAtomValue(isBlendAtom);
  const seed = useRef(Math.random() * 500);

  return (
    <mesh ref={ref}>
      {directions.map((direction, i) => {
        if (rendersGlobe || direction === VECTOR_FRONT)
          return (
            <TerrainFace
              wireframe={wireframe}
              resolution={resolution}
              radius={radius}
              localUp={direction}
              key={`terrain-face-${i}-${rendersGlobe ? "globe" : "face"}`}
              renderBackface={!rendersGlobe}
              isBlend={isBlend}
              seed={seed.current}
            />
          );

        return (
          <WireFace
            resolution={10}
            radius={radius}
            localUp={direction}
            key={`wire-face-${i}`}
          />
        );
      })}
    </mesh>
  );
});
export default PlanetGPU;
