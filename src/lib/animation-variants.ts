import { Variants } from "framer-motion";

export const polaroidContainerVariants: Variants = {
  initial: {
    y: "100%",
    x: 20,
  },
  animate: {
    y: 10,
    x: 0,
    transition: {
      delay: 1,
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
};

export const worldVariants: Variants = {
  initial: {
    rotateY: -1,
    scale: 0.9,
  },
  editor: {
    rotateY: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
    },
  },
  showcase: {
    rotateY: Math.PI * 2,
    scale: 1,
    transition: {
      repeatType: "loop",
      duration: 8,
      type: "tween",
      ease: "linear",
      repeat: Infinity,
    },
  },
};
