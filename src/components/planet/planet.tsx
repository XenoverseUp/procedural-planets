import { extend } from "@react-three/fiber";
import TerrainFace from "./terrain-face";
import { Vector3 } from "three";
import {
  VECTOR_BACK,
  VECTOR_DOWN,
  VECTOR_FRONT,
  VECTOR_LEFT,
  VECTOR_RIGHT,
  VECTOR_UP,
} from "../../util/vector";
import { useAtomValue } from "jotai";
import {
  isWireframeAtom,
  meshResolutionAtom,
  planetRadiusAtom,
  rendersGlobeAtom,
} from "@/atoms/settings";
import { createNoise3D } from "simplex-noise";
import { useRef } from "react";
import WireFace from "./wire-face";

const directions = [
  VECTOR_UP,
  VECTOR_DOWN,
  VECTOR_LEFT,
  VECTOR_RIGHT,
  VECTOR_FRONT,
  VECTOR_BACK,
];

const Planet = () => {
  const meshResolution = useAtomValue(meshResolutionAtom);
  const isWireframe = useAtomValue(isWireframeAtom);
  const planetRadius = useAtomValue(planetRadiusAtom);
  const rendersGlobe = useAtomValue(rendersGlobeAtom);

  return (
    <mesh>
      {directions.map((direction, i) => {
        if (rendersGlobe || direction === VECTOR_FRONT)
          return (
            <TerrainFace
              wireframe={isWireframe}
              resolution={meshResolution}
              radius={planetRadius}
              localUp={direction}
              key={`terrain-face-${i}`}
              renderBackface={!rendersGlobe}
            />
          );

        return (
          <WireFace
            resolution={10}
            radius={planetRadius}
            localUp={direction}
            key={`wire-face-${i}`}
          />
        );
      })}
    </mesh>
  );
};

export default Planet;
