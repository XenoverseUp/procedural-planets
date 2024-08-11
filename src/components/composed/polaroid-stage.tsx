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

const PolaroidStage = () => {
  const [polaroid, setPolaroid] = useAtom(polaroidAtom);

  return createPortal(
    <AnimatePresence>
      {polaroid !== null && (
        <motion.div
          variants={overlayVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          onClick={() => setPolaroid(null)}
          className="fixed inset-0 z-40 grid place-items-center bg-black/50 backdrop-blur-3xl"
        >
          <Polaroid />
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("polaroid-showcase") as Element,
  );
};

const Polaroid = () => {
  const [hover, setHover] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXSpring = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(mouseY, { stiffness: 100, damping: 20 });

  const card = useRef<HTMLDivElement>(null);

  const onMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!card.current) return;

    const rect = card.current.getBoundingClientRect();

    const progressX = e.clientX - rect.left - 32;
    const progressY = e.clientY - rect.top - 32;
    mouseX.set(progressX);
    mouseY.set(progressY);
  };

  useEffect(() => {
    // @ts-ignore
    document.addEventListener("pointermove", onMouseMove);

    return () => {
      // @ts-ignore
      document.removeEventListener("pointermove", onMouseMove);
    };
  }, []);

  return (
    <motion.div
      ref={card}
      variants={showcasePolaroidVariants}
      initial="initial"
      animate="animate"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onClick={(e) => e.stopPropagation()}
      className="relative cursor-none rounded bg-black p-4"
    >
      <AnimatePresence>
        {hover && (
          <motion.button
            style={{
              x: mouseX,
              y: mouseY,
            }}
            initial={{
              scale: 0.6,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
            className="pointer-events-none absolute left-0 top-0 size-16 rounded-full bg-white"
          >
            share
          </motion.button>
        )}
      </AnimatePresence>
      <div className="size-72 bg-neutral-900"></div>
      <header className="h-20"></header>
    </motion.div>
  );
};

export default PolaroidStage;
