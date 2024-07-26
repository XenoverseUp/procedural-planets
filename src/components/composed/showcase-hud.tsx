import {
  depthGradientAtom,
  elevationGradientAtom,
  planetRadiusAtom,
} from "@/atoms/settings";
import { isShowcaseAtom } from "@/atoms/showcase";
import cn from "@/lib/cn";
import {
  generatePlanetFact,
  generatePlanetName,
} from "@/lib/generate-planet-name";
import { gradientToString } from "@/lib/gradient";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useRef } from "react";

const ShowcaseHUD = () => {
  const planetName = useRef(generatePlanetName());
  const planetFact = useRef(generatePlanetFact(planetName.current));
  const depthGradient = useAtomValue(depthGradientAtom);
  const elevationGradient = useAtomValue(elevationGradientAtom);

  return (
    <>
      <motion.h1
        initial={{
          opacity: 0,
          y: -30,
          scale: 0.8,
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

      <div className="fixed bottom-16 left-0 right-0 mx-auto flex max-w-[40rem] flex-col place-items-center justify-center gap-4">
        <p className="text-balance text-center font-light text-white/80">
          {planetFact.current}
        </p>
      </div>

      <div className="fixed bottom-2 right-2 flex h-8 cursor-pointer items-center justify-center rounded bg-neutral-800 px-4 text-white">
        Download
      </div>
    </>
  );
};

export default ShowcaseHUD;
