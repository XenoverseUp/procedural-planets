import { polaroidAtom } from "@/atoms/showcase";
import { overlayVariants } from "@/lib/animation-variants";
import { motion, AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
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
          <motion.div className="size-32 bg-black">
            <p className="text-white">{polaroid}</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("polaroid-showcase") as Element,
  );
};

export default PolaroidStage;
