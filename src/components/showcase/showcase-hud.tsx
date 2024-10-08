// @ts-ignore
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import cn from "@/lib/cn";
import {
  generatePlanetFact,
  generatePlanetName,
} from "@/lib/generate-planet-name";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Mesh, Vector3 } from "three";
import { exportGeometryToOBJ } from "@/lib/export-mesh";

import Film, { FilmImage } from "@/components/showcase/film";
import PolaroidStage from "@/components/showcase/polaroid-stage";
import {
  showcaseFunFactVariants,
  showcaseTitleVariants,
} from "@/lib/animation-variants";
import { useAtomValue, useSetAtom } from "jotai";
import { isShowcaseAtom } from "@/atoms/showcase";
import { polaroidAtom } from "@/atoms/showcase";
import { DownloadIcon, ResetIcon } from "@radix-ui/react-icons";

type ShowcaseHUDProps = {
  capture: (
    position?: Vector3,
    lookAt?: Vector3,
  ) => Promise<string> | undefined;
  planetRef: Mesh;
};

const ShowcaseHUD = ({ planetRef, capture }: ShowcaseHUDProps) => {
  const planetName = useRef(generatePlanetName());
  const planetFact = useRef(generatePlanetFact(planetName.current));
  const setPolaroid = useSetAtom(polaroidAtom);
  const [images, setImages] = useState<string[]>([]);
  const setIsShowcase = useSetAtom(isShowcaseAtom);

  const mergeAndExport = () => {
    if (!planetRef) return;

    const mergedGeometry = BufferGeometryUtils.mergeGeometries(
      planetRef.children.map((child) => (child as Mesh).geometry),
      true,
    );

    exportGeometryToOBJ(mergedGeometry);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setPolaroid(null);
  };

  useEffect(() => {
    (async () => {
      const images = await Promise.all([
        capture?.(new Vector3(2.5, 2.5, 2.5)) ?? "",
        capture?.(new Vector3(-1.5, 2, 2), new Vector3(3, 0, 0)) ?? "",
        capture?.(new Vector3(2, -1, 1.5), new Vector3(0, 2.5, 0)) ?? "",
      ]);
      setImages(images);
    })();

    document.addEventListener("keyup", onKeyDown);

    return () => document.removeEventListener("keyup", onKeyDown);
  }, []);

  return (
    <>
      <motion.h1
        variants={showcaseTitleVariants}
        initial="initial"
        animate="animate"
        className={cn(
          "fixed left-0 right-0 top-28 mx-auto inline-block h-32 w-fit text-center font-sud text-8xl text-blue-200",
        )}
      >
        {planetName.current}
      </motion.h1>

      <motion.div
        variants={showcaseFunFactVariants}
        initial="initial"
        animate="animate"
        className="fixed bottom-12 left-0 right-0 mx-auto flex max-w-[30rem] flex-col place-items-center justify-center gap-2"
      >
        <h2 className="text-center font-sud text-xl text-blue-300">Fun Fact</h2>
        <p className="text-balance text-center text-sm font-light text-white/80">
          {planetFact.current}
        </p>
      </motion.div>

      <Film>
        <FilmImage src={images.at(0) as string} />
        <FilmImage src={images.at(1) as string} />
        <FilmImage src={images.at(2) as string} />
      </Film>

      <PolaroidStage planetName={planetName.current} images={images} />

      <div className="fixed bottom-4 left-4 flex items-center justify-center gap-2">
        <button
          onClick={() => window.location.reload()}
          aria-label="Reset"
          className="flex size-8 items-center justify-center gap-2 rounded-full border border-white/40 bg-black/40 text-sm font-light text-white opacity-80 backdrop-blur hover:bg-white/10 active:bg-white/15"
        >
          <ResetIcon />
          {/* Reset */}
        </button>
        <button
          onClick={mergeAndExport}
          className="flex h-8 items-center justify-center gap-2 rounded-full border border-white/40 bg-black/40 px-3 text-sm font-light text-white opacity-80 backdrop-blur hover:bg-white/10 active:bg-white/15"
        >
          <DownloadIcon />
          Download
        </button>
      </div>
    </>
  );
};

export default ShowcaseHUD;
