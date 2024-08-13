import { polaroidContainerVariants } from "@/lib/animation-variants";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, cloneElement, Children, ReactElement } from "react";
import cn from "@/lib/cn";
import { useAtom } from "jotai";
import { polaroidAtom } from "@/atoms/showcase";
import starfield from "@/assets/img/starfield.png";
import pad from "@/lib/pad";

const Polaroid = ({ children }: { children: ReactElement[] }) => {
  const angle = useMotionValue(-5);
  const angleSpring = useSpring(angle, {
    stiffness: 100,
    damping: 20,
  });

  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      variants={polaroidContainerVariants}
      initial="initial"
      animate="animate"
      style={{
        rotateZ: angleSpring,
      }}
      whileHover={{
        translateY: -7,
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const progress = (e.clientX - rect.left) / rect.width;
        angle.set((progress - 1) * 10);
      }}
      onMouseLeave={() => angle.set(-5)}
      className="fixed -bottom-5 right-10 z-30 flex origin-bottom rounded-t bg-blue-300 shadow-2xl shadow-blue-300/50 perspective-1600"
    >
      <div
        aria-hidden
        className="flex flex-col justify-center gap-2 overflow-hidden px-1.5 py-1"
      >
        {new Array(23).fill(null).map((_, i) => (
          <span
            key={`polaroid-strip-1-${i}`}
            className="size-3 rounded bg-black"
          />
        ))}
      </div>
      <div className="space-y-1 pb-2 pt-3">
        {Children.map(children, (child, i) =>
          cloneElement(child, {
            i,
            hovered,
            setHovered,
          }),
        )}
        <div
          className={cn("h-12 w-full bg-black transition-opacity", {
            "opacity-80": hovered !== null,
          })}
        ></div>
      </div>
      <div
        aria-hidden
        className="flex flex-col justify-center gap-2 overflow-hidden px-1.5 py-1"
      >
        {new Array(23).fill(null).map((_, i) => (
          <span
            key={`polaroid-strip-2-${i}`}
            className="size-3 rounded bg-black"
          />
        ))}
      </div>
    </motion.div>
  );
};

type PolaroidImageProps = {
  i?: number;
  hovered?: number;
  setHovered?: (v: number | null) => void;
  src: string;
};

export const PolaroidImage = ({
  i = 0,
  hovered,
  setHovered,
  src,
}: PolaroidImageProps) => {
  const [_, setPolaroid] = useAtom(polaroidAtom);

  return (
    <motion.div
      animate={
        i === hovered || hovered === null ? { opacity: 1 } : { opacity: 0.8 }
      }
      className="relative size-32 cursor-pointer overflow-hidden rounded bg-black shadow-lg"
      onMouseOver={() => setHovered?.(i!)}
      onMouseOut={() => setHovered?.(null)}
      onClick={() => setPolaroid(i)}
    >
      <img
        src={starfield}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <span
        aria-hidden
        className="absolute left-2 top-2 text-xs font-medium text-blue-200 opacity-40"
      >
        {pad(i, "0", 2)}
      </span>
      <img
        src={src}
        className="absolute inset-0 h-full w-full object-cover opacity-60 blur-lg"
      />
      <img src={src} className="absolute inset-0 h-full w-full object-cover" />
    </motion.div>
  );
};

export default Polaroid;
