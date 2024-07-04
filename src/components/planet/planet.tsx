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
} from "../../atoms/settings";

const Planet = () => {
  const meshResolution = useAtomValue(meshResolutionAtom);
  const isWireframe = useAtomValue(isWireframeAtom);
  const planetRadius = useAtomValue(planetRadiusAtom);

  return (
    <mesh>
      <TerrainFace
        wireframe={isWireframe}
        resolution={meshResolution}
        radius={planetRadius}
        localUp={VECTOR_UP}
      />
      <TerrainFace
        wireframe={isWireframe}
        resolution={meshResolution}
        radius={planetRadius}
        localUp={VECTOR_DOWN}
      />
      <TerrainFace
        wireframe={isWireframe}
        resolution={meshResolution}
        radius={planetRadius}
        localUp={VECTOR_LEFT}
      />
      <TerrainFace
        wireframe={isWireframe}
        resolution={meshResolution}
        radius={planetRadius}
        localUp={VECTOR_RIGHT}
      />
      <TerrainFace
        wireframe={isWireframe}
        resolution={meshResolution}
        radius={planetRadius}
        localUp={VECTOR_FRONT}
      />
      <TerrainFace
        wireframe={isWireframe}
        resolution={meshResolution}
        radius={planetRadius}
        localUp={VECTOR_BACK}
      />
    </mesh>
  );
};

export default Planet;
