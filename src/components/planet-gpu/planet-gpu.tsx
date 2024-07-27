import { useAtomValue } from "jotai";
import { useMotionValue, useSpring } from "framer-motion";
import { motion } from "framer-motion-3d";
import { forwardRef, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
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
import { worldVariants } from "@/lib/animation-variants";
import { exportMeshToOBJ } from "@/lib/export-mesh";

const directions = [
  VECTOR_UP,
  VECTOR_DOWN,
  VECTOR_LEFT,
  VECTOR_RIGHT,
  VECTOR_FRONT,
  VECTOR_BACK,
];

const GRAB_SPEED = 0.01;

const PlanetGPU = forwardRef(({ showcase }: { showcase: boolean }, ref) => {
  const resolution = useAtomValue(meshResolutionAtom);
  const wireframe = useAtomValue(isWireframeAtom);
  const radius = useAtomValue(planetRadiusAtom);
  const rendersGlobe = useAtomValue(rendersGlobeAtom);
  const isBlend = useAtomValue(isBlendAtom);
  const seed = useRef(Math.random() * 500);

  const three = useThree();
  const rotationX = useMotionValue(0);
  const rotationY = useMotionValue(0);
  const springRotationX = useSpring(rotationX, { stiffness: 100, damping: 20 });
  const springRotationY = useSpring(rotationY, { stiffness: 100, damping: 20 });

  const onCanvasMove = (e: PointerEvent) => {
    if (e.buttons === 1) {
      rotationY.set(rotationY.get() + e.movementX * GRAB_SPEED);

      if (rotationX.get() > 0.75) rotationX.set(0.75);
      else if (rotationX.get() < -0.75) rotationX.set(-0.75);
      else rotationX.set(rotationX.get() + e.movementY * GRAB_SPEED);
    }
  };

  const onCanvasUp = () => {
    if (rotationX.get() > 0.5) rotationX.set(0.5);
    else if (rotationX.get() < -0.5) rotationX.set(-0.5);
  };

  useEffect(() => {
    if (showcase) rotationX.set(0.25);
  }, [showcase]);

  useEffect(() => {
    const canvas = three.gl.domElement;

    canvas.addEventListener("pointermove", onCanvasMove);
    canvas.addEventListener("pointerup", onCanvasUp);
    canvas.addEventListener("pointerout", onCanvasUp);

    return () => {
      canvas.removeEventListener("pointermove", onCanvasMove);
      canvas.removeEventListener("pointerup", onCanvasUp);
      canvas.removeEventListener("pointerout", onCanvasUp);
    };
  }, []);

  return (
    <motion.group rotation-x={springRotationX} rotation-y={springRotationY}>
      <motion.mesh
        // @ts-ignore
        ref={ref}
        variants={worldVariants}
        initial="initial"
        animate={showcase ? "showcase" : "editor"}
      >
        {directions.map((direction, i) =>
          rendersGlobe || direction === VECTOR_FRONT ? (
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
          ) : (
            <WireFace
              resolution={10}
              radius={radius}
              localUp={direction}
              key={`wire-face-${i}`}
            />
          ),
        )}
      </motion.mesh>
    </motion.group>
  );
});

export default PlanetGPU;
