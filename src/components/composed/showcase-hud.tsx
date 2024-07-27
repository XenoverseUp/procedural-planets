import {
  depthGradientAtom,
  elevationGradientAtom,
  planetRadiusAtom,
} from "@/atoms/settings";
import cn from "@/lib/cn";
import {
  generatePlanetFact,
  generatePlanetName,
} from "@/lib/generate-planet-name";
import { motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useRef } from "react";
import { Mesh } from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { exportGeometryToOBJ } from "@/lib/export-mesh";

const ShowcaseHUD = ({ planetRef }: { planetRef: Mesh }) => {
  const planetName = useRef(generatePlanetName());
  const planetFact = useRef(generatePlanetFact(planetName.current));

  const mergeAndExport = () => {
    if (!planetRef) return;

    const mergedGeometry = BufferGeometryUtils.mergeGeometries(
      planetRef.children.map((child) => (child as Mesh).geometry),
      true,
    );

    console.log(mergedGeometry);

    exportGeometryToOBJ(mergedGeometry);
  };

  return (
    <>
      <motion.h1
        initial={{
          opacity: 0,
          y: -30,
          scale: 0.9,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,

          transition: {
            type: "spring",
            bounce: 0.25,
            duration: 1.5,
            delay: 0.5,
          },
        }}
        className={cn(
          "font-sud fixed left-0 right-0 top-28 mx-auto inline-block h-32 w-fit text-center text-8xl text-blue-200",
        )}
      >
        {planetName.current}
      </motion.h1>

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          transition: {
            delay: 0.3,
          },
        }}
        className="fixed bottom-16 left-0 right-0 mx-auto flex max-w-[40rem] flex-col place-items-center justify-center gap-4"
      >
        <p className="text-balance text-center font-light text-white/80">
          {planetFact.current}
        </p>
      </motion.div>

      <div
        onClick={mergeAndExport}
        className="fixed bottom-2 right-2 z-30 flex h-8 cursor-pointer items-center justify-center rounded bg-neutral-800 px-4 text-white"
      >
        Download
      </div>
    </>
  );
};

export default ShowcaseHUD;
