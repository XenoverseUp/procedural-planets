import { Variants } from "framer-motion";

export const showcaseFunFactVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      delay: 0.75,
    },
  },
};

export const showcaseTitleVariants: Variants = {
  initial: {
    opacity: 0,
    y: -30,
    scale: 0.9,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      type: "spring",
      bounce: 0.25,
      duration: 1.5,
      delay: 0.5,
    },
  },
};

export const showcasePolaroidVariants: Variants = {
  initial: {
    y: 50,
    scale: 1,
    opacity: 0,
  },
  animate: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
    },
  },
};

export const overlayVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

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
