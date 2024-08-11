import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { AnimatePresence } from "framer-motion";
import Toolbar from "./toolbar";
import { motion } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import { isWireframeAtom, rendersGlobeAtom } from "@/atoms/settings";
import { isShowcaseAtom } from "@/atoms/showcase";
import { Vector3 } from "three";

const EditorHUD = () => {
  const [isShowcase, setIsShowcase] = useAtom(isShowcaseAtom);
  const setIsWireframe = useSetAtom(isWireframeAtom);
  const setRendersGlobe = useSetAtom(rendersGlobeAtom);

  return (
    <>
      <Toolbar className="absolute bottom-2 left-2 z-10" />
      <motion.button
        exit={{
          scale: 0.75,
          opacity: 0,
        }}
        transition={{
          mass: 10,
        }}
        onClick={() => {
          setIsShowcase(true);
          setIsWireframe(false);
          setRendersGlobe(true);
        }}
        className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-blue-200 px-4 py-1 text-sm text-blue-900 hover:brightness-95"
      >
        <span>Finish</span>
        <PaperPlaneIcon />
      </motion.button>
    </>
  );
};

export default EditorHUD;
