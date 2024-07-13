import TerrainFace from "./terrain-face";
import {
  VECTOR_BACK,
  VECTOR_DOWN,
  VECTOR_FRONT,
  VECTOR_LEFT,
  VECTOR_RIGHT,
  VECTOR_UP,
} from "@/lib/vector";
import { useAtomValue, useSetAtom } from "jotai";
import {
  isWireframeAtom,
  meshResolutionAtom,
  noiseFiltersAtom,
  planetRadiusAtom,
  rendersGlobeAtom,
} from "@/atoms/settings";

import WireFace from "./wire-face";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import MeshGenerator from "./mesh-generation";
import { maximumAtom, minimumAtom } from "@/atoms/minMax";

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
              key={`terrain-face-${i}-${rendersGlobe ? "globe" : "face"}`}
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
