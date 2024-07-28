// @ts-ignore
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import cn from "@/lib/cn";
import {
  generatePlanetFact,
  generatePlanetName,
} from "@/lib/generate-planet-name";
import { motion } from "framer-motion";
import { useRef } from "react";
import { Mesh } from "three";
import { exportGeometryToOBJ } from "@/lib/export-mesh";
import Polaroid, { PolaroidImage } from "./polariod";
import { polaroidContainerVariants } from "@/lib/animation-variants";

const ShowcaseHUD = ({ planetRef }: { planetRef: Mesh }) => {
  const planetName = useRef(generatePlanetName());
  const planetFact = useRef(generatePlanetFact(planetName.current));

  const mergeAndExport = () => {
    if (!planetRef) return;

    const mergedGeometry = BufferGeometryUtils.mergeGeometries(
      planetRef.children.map((child) => (child as Mesh).geometry),
      true,
    );

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
          "fixed left-0 right-0 top-28 mx-auto inline-block h-32 w-fit text-center font-sud text-8xl text-blue-200",
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
            delay: 0.75,
          },
        }}
        className="fixed bottom-12 left-0 right-0 mx-auto flex max-w-[30rem] flex-col place-items-center justify-center gap-2"
      >
        <h2 className="text-center font-sud text-xl text-blue-300">Fun Fact</h2>
        <p className="text-balance text-center text-sm font-light text-white/80">
          {planetFact.current}
        </p>
      </motion.div>
      <Polaroid>
        <PolaroidImage />
        <PolaroidImage />
        <PolaroidImage />
      </Polaroid>

      {/* <div
        onClick={mergeAndExport}
        className="fixed bottom-2 left-2 z-30 flex h-8 cursor-pointer items-center justify-center rounded bg-neutral-800 px-4 text-white"
      >
        Download
      </div> */}
    </>
  );
};

export default ShowcaseHUD;
