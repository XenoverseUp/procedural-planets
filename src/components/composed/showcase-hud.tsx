import { isShowcaseAtom } from "@/atoms/showcase";
import cn from "@/lib/cn";
import {
  generatePlanetFact,
  generatePlanetName,
} from "@/lib/generate-planet-name";
import { AnimatePresence, motion } from "framer-motion";
import { useAtomValue } from "jotai";
import { useRef } from "react";

const ShowcaseHUD = () => {
  const isShowcase = useAtomValue(isShowcaseAtom);
  const planetName = useRef(generatePlanetName());
  const planetFact = useRef(generatePlanetFact(planetName.current));

  return (
    <>
      <motion.h1
        initial={{
          opacity: 0,
          y: 96,
          scale: 0.7,
        }}
        animate={{
          opacity: 1,
          y: -10,
          scale: 1,

          transition: {
            type: "spring",
            bounce: 0.25,
            duration: 1.5,
            delay: 0.5,
          },
        }}
        className="fixed left-0 top-40 w-full text-center text-7xl text-blue-200"
      >
        {planetName.current}
      </motion.h1>

      <div className="fixed bottom-12 left-0 right-0 isolate z-30 mx-auto flex max-w-[40rem] flex-col place-items-center justify-center gap-4">
        <p className="text-balance text-center font-light text-white/80">
          {planetFact.current}
        </p>
        <button className="rounded-full bg-white px-2">Share</button>
      </div>
    </>
  );
};

export default ShowcaseHUD;
