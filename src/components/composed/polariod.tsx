import { polaroidVariants } from "@/lib/animation-variants";
import { motion } from "framer-motion";
import img from "@/assets/img/ss.png";

const Polaroid = ({ i }: { i: number }) => {
  return (
    <motion.div
      variants={polaroidVariants}
      className="group transform-gpu cursor-pointer space-y-1 rounded-md bg-neutral-800 shadow-lg transition-[transform,opacity] duration-300 ease-in-out"
    >
      <div className="size-32 overflow-hidden rounded bg-white/5">
        <img src={img} className="object-cover" />
      </div>
    </motion.div>
  );
};

export default Polaroid;
