import { polaroidAtom } from "@/atoms/showcase";
import {
  overlayVariants,
  showcasePolaroidVariants,
} from "@/lib/animation-variants";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import { forwardRef, useRef } from "react";
import { createPortal } from "react-dom";
import starfield from "@/assets/img/starfield.png";
import { Cross2Icon, DownloadIcon } from "@radix-ui/react-icons";
import pad from "@/lib/pad";
import { useScreenshot } from "@/hooks/useScreenshot";
import cn from "@/lib/cn";

const PolaroidStage = ({
  images,
  planetName,
}: {
  images: string[];
  planetName: string;
}) => {
  const [polaroid, setPolaroid] = useAtom(polaroidAtom);
  const time = useRef(new Date()).current;
  const distance = useRef(Math.floor(Math.random() * 200 + 1)).current;

  const { elementRef, downloadScreenshot, loading } =
    useScreenshot<HTMLDivElement>();

  return createPortal(
    <AnimatePresence>
      {polaroid !== null && (
        <motion.div
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={() => setPolaroid(null)}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-black/50 backdrop-blur-xl"
        >
          <Polaroid
            {...{ time, distance }}
            name={planetName}
            src={images.at(polaroid) as string}
            id={polaroid}
            ref={elementRef}
          />
          <motion.div
            animate={{ opacity: 1, transition: { delay: 0.4 } }}
            className="-z-10 flex items-center justify-center gap-2 rounded-full opacity-0"
          >
            <button
              onClick={async (e) => {
                e.stopPropagation();
                await downloadScreenshot(4);
              }}
              className="relative h-8 rounded-full border border-white/40 bg-black/40 px-3 text-sm font-light text-white opacity-80 hover:bg-white/10 active:bg-white/15"
            >
              <span
                className={cn(
                  "flex items-center gap-2 opacity-100 transition-opacity",
                  {
                    "opacity-0": loading,
                  },
                )}
              >
                <DownloadIcon />
                Get Polaroid
              </span>

              <span
                className={cn(
                  "absolute inset-0 flex h-full w-full items-center justify-center gap-2 opacity-0 transition-opacity",
                  {
                    "opacity-100": loading,
                  },
                )}
              >
                <DownloadIcon />
                Generating...
              </span>
            </button>
            <button className="grid size-8 place-items-center rounded-full border border-white/40 bg-black/40 font-medium text-white hover:bg-white/10 active:bg-white/15">
              <Cross2Icon />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("polaroid-showcase") as Element,
  );
};

type PolaroidProps = {
  src: string;
  name: string;
  time: Date;
  distance: number;
  id: number;
};

const Polaroid = forwardRef<HTMLDivElement, PolaroidProps>(
  ({ src, name, time, distance, id }, ref) => {
    return (
      <motion.div
        variants={showcasePolaroidVariants}
        initial="initial"
        animate="animate"
        onClick={(e) => e.stopPropagation()}
        className="relative isolate bg-blue-100 p-5"
        ref={ref}
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
          <svg
            className="absolute right-4 top-4 size-6 fill-blue-400"
            viewBox="0 0 84 83"
            xmlns="http://www.w3.org/2000/svg"
            strokeWidth={4}
          >
            <path d="M71.4357 12.4144C79.3054 20.2841 83.0379 30.7233 82.6329 41.0328C82.1386 41.0522 81.644 41.0621 81.1493 41.0625C81.1308 41.0625 81.1123 41.0625 81.0938 41.0625C71.2912 41.0563 61.4927 37.3139 54.0145 29.8356C46.1448 21.9659 42.4123 11.5267 42.8173 1.21723C53.1268 0.812181 63.566 4.54468 71.4357 12.4144ZM30.1857 29.8356C22.7092 37.3121 12.9136 41.0545 3.11334 41.0625C3.09449 41.0625 3.07565 41.0625 3.0568 41.0625C2.56021 41.0622 2.06362 41.0523 1.56733 41.0328C1.16228 30.7233 4.89478 20.2841 12.7645 12.4144C20.6342 4.54468 31.0734 0.812181 41.3829 1.21723C41.7879 11.5267 38.0554 21.9659 30.1857 29.8356ZM3.0568 42.4375C3.07334 42.4375 3.08987 42.4375 3.10641 42.4375C12.909 42.4437 22.7075 46.1861 30.1857 53.6644C38.0554 61.5341 41.7879 71.9733 41.3829 82.2828C31.0734 82.6878 20.6342 78.9553 12.7645 71.0856C4.89478 63.2159 1.16228 52.7767 1.56733 42.4672C2.06362 42.4477 2.56021 42.4378 3.0568 42.4375ZM81.1434 42.4375C81.64 42.4378 82.1366 42.4477 82.6329 42.4672C83.0379 52.7767 79.3054 63.2159 71.4357 71.0856C63.566 78.9553 53.1268 82.6878 42.8173 82.2828C42.4123 71.9733 46.1448 61.5341 54.0145 53.6644C61.4927 46.1861 71.2912 42.4437 81.0938 42.4375C81.1103 42.4375 81.1269 42.4375 81.1434 42.4375Z" />
          </svg>
        </div>
        <header className="flex justify-between px-2 pb-2 pt-4">
          <div>
            <h3 className="text-2xl font-medium">{name}</h3>
            <p className="whitespace-nowrap opacity-70">
              <span className="font-medium">{distance} million</span> light
              years away
            </p>
          </div>
          <span className="mr-1 mt-1 text-sm opacity-50">
            {pad(time.getHours(), "0", 2)}:{pad(time.getMinutes(), "0", 2)}
          </span>
        </header>
      </motion.div>
    );
  },
);

export default PolaroidStage;
