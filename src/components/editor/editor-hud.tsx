import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import { isWireframeAtom, rendersGlobeAtom } from "@/atoms/settings";
import { isShowcaseAtom } from "@/atoms/showcase";
import Toolbar from "@/components/editor/toolbar";

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
        className="absolute bottom-4 right-4 flex h-8 items-center gap-2 rounded-full border border-blue-300 bg-blue-100/60 px-4 text-sm text-sky-700 backdrop-blur hover:bg-blue-100"
      >
        <PaperPlaneIcon />
        <span>Finish</span>
      </motion.button>
    </>
  );
};

export default EditorHUD;
