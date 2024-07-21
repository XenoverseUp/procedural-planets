import Sidebar from "@/components/composed/sidebar";
import Toolbar from "@/components/composed/toolbar";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import cn from "@/lib/cn";
import Scene from "@/components/composed/scene";
import { Canvas } from "@react-three/fiber";
import { useAtom, useSetAtom } from "jotai";
import { isShowcaseAtom } from "@/atoms/showcase";
import { isWireframeAtom, rendersGlobeAtom } from "@/atoms/settings";

function App() {
  const [isShowcase, setIsShowcase] = useAtom(isShowcaseAtom);
  const setIsWireframe = useSetAtom(isWireframeAtom);
  const setRendersGlobe = useSetAtom(rendersGlobeAtom);

  return (
    <main
      className={cn(
        "flex h-screen w-full select-none bg-blue-200 p-2 pr-0 transition-colors",
        {
          "bg-black": isShowcase,
        },
      )}
    >
      <div
        className={cn(
          "dotted relative mr-2 h-full flex-grow rounded-lg bg-blue-50 transition-colors",
          {
            "dotted-dark bg-transparent": isShowcase,
          },
        )}
      >
        <div className="mx-auto h-full w-[calc(100vw_-_26rem)] overflow-hidden">
          <AnimatePresence>
            {!isShowcase && (
              <Toolbar className="absolute bottom-2 left-2 z-10" />
            )}
          </AnimatePresence>
          <Canvas>
            <Scene />
          </Canvas>
          <AnimatePresence>
            {!isShowcase && (
              <motion.button
                exit={{
                  scale: 0.75,
                  opacity: 0,
                }}
                transition={{
                  mass: 10,
                }}
                onClick={() => {
                  setIsShowcase((state) => !state);
                  setIsWireframe(false);
                  setRendersGlobe(true);
                }}
                className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-blue-200 px-4 py-1 text-sm text-blue-900 hover:brightness-95"
              >
                <span>Finish</span>
                <PaperPlaneIcon />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>{!isShowcase && <Sidebar />}</AnimatePresence>
    </main>
  );
}

export default App;
