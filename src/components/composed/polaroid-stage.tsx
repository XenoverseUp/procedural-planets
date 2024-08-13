import { polaroidAtom } from "@/atoms/showcase";
import {
  overlayVariants,
  showcasePolaroidVariants,
} from "@/lib/animation-variants";
import {
  motion,
  animate,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useAtom } from "jotai";
import { MouseEventHandler, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import starfield from "@/assets/img/starfield.png";
import paper from "@/assets/img/paper.jpg";
import { Cross2Icon, Share1Icon, Share2Icon } from "@radix-ui/react-icons";
import pad from "@/lib/pad";

const PolaroidStage = ({
  images,
  planetName,
}: {
  images: string[];
  planetName: string;
}) => {
  const [polaroid, setPolaroid] = useAtom(polaroidAtom);
  const time = useRef(new Date()).current;
  const distance = useRef(Math.floor(Math.random() * 27 + 1)).current;

  return createPortal(
    <AnimatePresence>
      {polaroid !== null && (
        <motion.div
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={() => setPolaroid(null)}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-black/50 backdrop-blur-3xl"
        >
          <Polaroid
            {...{ time, distance }}
            name={planetName}
            src={images.at(polaroid) as string}
          />
          <div className="-z-10 flex items-center justify-center gap-2">
            <button className="flex h-8 items-center gap-2 rounded-full border border-white/40 bg-black/40 px-3 text-sm font-light text-white opacity-80 transition-transform hover:scale-105 hover:bg-white/10">
              <Share2Icon />
              Share
            </button>
            <button className="grid size-8 place-items-center rounded-full border border-white/40 bg-black/40 font-medium text-white transition-transform hover:scale-105 hover:bg-white/10">
              <Cross2Icon />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("polaroid-showcase") as Element,
  );
};

const Polaroid = ({
  src,
  name,
  time,
  distance,
}: {
  src: string;
  name: string;
  time: Date;
  distance: number;
}) => {
  return (
    <motion.div
      variants={showcasePolaroidVariants}
      initial="initial"
      animate="animate"
      onClick={(e) => e.stopPropagation()}
      className="relative isolate bg-blue-100 p-4"
    >
      <div className="relative size-72 overflow-hidden bg-black">
        <img
          src={starfield}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          {...{ src }}
          alt="planet landscape"
          className="absolute inset-0 h-full w-full object-cover opacity-60 blur-2xl saturate-200"
        />
        <img
          {...{ src }}
          alt="planet landscape"
          className="absolute inset-0 h-full w-full object-cover shadow-inner"
        />
      </div>
      <header className="flex justify-between px-1 pt-2">
        <div>
          <h3 className="text-xl font-medium">{name}</h3>
          <p className="text-sm opacity-80">
            <span className="font-medium">{distance} million</span> light years
            away
          </p>
        </div>
        <span className="mr-1 mt-1 text-xs opacity-50">
          {pad(time.getHours(), "0", 2)}:{pad(time.getMinutes(), "0", 2)}
        </span>
      </header>
    </motion.div>
  );
};

export default PolaroidStage;
