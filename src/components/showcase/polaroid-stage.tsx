import { polaroidAtom } from "@/atoms/showcase";
import {
  overlayVariants,
  showcasePolaroidVariants,
} from "@/lib/animation-variants";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { useRef } from "react";
import { createPortal } from "react-dom";
import starfield from "@/assets/img/starfield.png";
import { Cross2Icon, DownloadIcon } from "@radix-ui/react-icons";
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
            id={polaroid}
          />
          <motion.div
            animate={{ opacity: 1, transition: { delay: 0.5 } }}
            className="-z-10 flex items-center justify-center gap-2 opacity-0"
          >
            <button className="flex h-8 items-center gap-2 rounded-full border border-white/40 bg-black/40 px-3 text-sm font-light text-white opacity-80 transition-transform hover:scale-105 hover:bg-white/10">
              <DownloadIcon />
              Get Polaroid
            </button>
            <button className="grid size-8 place-items-center rounded-full border border-white/40 bg-black/40 font-medium text-white transition-transform hover:scale-105 hover:bg-white/10">
              <Cross2Icon />
            </button>
          </motion.div>
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
  id,
}: {
  src: string;
  name: string;
  time: Date;
  distance: number;
  id: number;
}) => {
  return (
    <motion.div
      variants={showcasePolaroidVariants}
      initial="initial"
      animate="animate"
      onClick={(e) => e.stopPropagation()}
      className="relative isolate bg-blue-100 p-5"
    >
      <div className="relative size-96 overflow-hidden bg-black">
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
        <span
          aria-hidden
          className="absolute left-4 top-3 font-medium text-blue-200 opacity-40"
        >
          #{id}
        </span>
      </div>
      <header className="flex justify-between px-2 pb-2 pt-4">
        <div>
          <h3 className="text-2xl font-medium">{name}</h3>
          <p className="opacity-70">
            <span className="font-medium">{distance} million</span> light years
            away
          </p>
        </div>
        <span className="mr-1 mt-1 text-sm opacity-50">
          {pad(time.getHours(), "0", 2)}:{pad(time.getMinutes(), "0", 2)}
        </span>
      </header>
    </motion.div>
  );
};

export default PolaroidStage;
