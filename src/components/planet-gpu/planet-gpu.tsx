import { useAtomValue } from "jotai";
import { motion } from "framer-motion-3d";
import { useMotionValue } from "framer-motion";
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
import { forwardRef, useEffect, useRef, useState } from "react";
import { worldVariants } from "@/lib/animation-variants";
import { useThree } from "@react-three/fiber";
import { Vector2 } from "three";

const directions = [
  VECTOR_UP,
  VECTOR_DOWN,
  VECTOR_LEFT,
  VECTOR_RIGHT,
  VECTOR_FRONT,
  VECTOR_BACK,
];

const PlanetGPU = ({ showcase }: { showcase: boolean }) => {
  const resolution = useAtomValue(meshResolutionAtom);
  const wireframe = useAtomValue(isWireframeAtom);
  const radius = useAtomValue(planetRadiusAtom);
  const rendersGlobe = useAtomValue(rendersGlobeAtom);
  const isBlend = useAtomValue(isBlendAtom);
  const seed = useRef(Math.random() * 500);

  const three = useThree();

  const onCanvasDown = (e: PointerEvent) => {};

  const onCanvasMove = (e: PointerEvent) => {};

  const onCanvasUp = () => {};

  useEffect(() => {
    const canvas = three.gl.domElement;

    canvas.addEventListener("pointerdown", onCanvasDown);
    canvas.addEventListener("pointermove", onCanvasMove);
    canvas.addEventListener("pointerup", onCanvasUp);

    return () => {
      canvas.removeEventListener("pointerdown", onCanvasDown);
      canvas.removeEventListener("pointermove", onCanvasMove);
      canvas.removeEventListener("pointerup", onCanvasUp);
    };
  }, []);

  return (
    <motion.mesh
      variants={worldVariants}
      initial="initial"
      animate={showcase ? "showcase" : "editor"}
    >
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
    </motion.mesh>
  );
};

export default PlanetGPU;
