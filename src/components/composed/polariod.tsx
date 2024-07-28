import { polaroidContainerVariants } from "@/lib/animation-variants";
import { motion, useMotionValue, useSpring } from "framer-motion";
import img from "@/assets/img/ss.png";
import { useState, cloneElement, Children, ReactElement } from "react";
import cn from "@/lib/cn";

const Polaroid = ({ children }: { children: ReactElement[] }) => {
  const angle = useMotionValue(-5);
  const angleSpring = useSpring(angle, {
    stiffness: 100,
    damping: 20,
  });

  const [selected, setSelected] = useState<number | null>(null);

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
      className="fixed -bottom-5 right-10 z-30 flex origin-bottom rounded-t bg-blue-300 perspective-1600"
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
            selected,
            setSelected,
          }),
        )}
        <div
          className={cn("h-12 w-full bg-black transition-opacity", {
            "opacity-80": selected !== null,
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
  selected?: number;
  setSelected?: (v: number | null) => void;
};

export const PolaroidImage = ({
  i,
  selected,
  setSelected,
}: PolaroidImageProps) => {
  return (
    <motion.div
      animate={
        i === selected || selected === null ? { opacity: 1 } : { opacity: 0.8 }
      }
      className="group cursor-pointer space-y-1 rounded-md bg-neutral-800 shadow-lg"
    >
      <div
        onMouseOver={() => setSelected?.(i!)}
        onMouseOut={() => setSelected?.(null)}
        className="size-32 overflow-hidden rounded bg-white/5"
      >
        <img src={img} className="object-cover" />
      </div>
    </motion.div>
  );
};

export default Polaroid;
