import { Variants } from "framer-motion";

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
