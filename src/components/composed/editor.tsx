import cn from "@/lib/cn";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import Renderer from "./renderer";
import { useAtomValue } from "jotai";
import { isShowcaseAtom } from "@/atoms/showcase";
import EditorHUD from "./editor-hud";
import { useRef } from "react";
import {
  generatePlanetFact,
  generatePlanetName,
} from "@/lib/generate-planet-name";
import ShowcaseHUD from "./showcase-hud";
import { Mesh } from "three";

const Editor = () => {
  const isShowcase = useAtomValue(isShowcaseAtom);
  const planetRef = useRef<Mesh>(null);

  return (
    <div
      className={cn(
        "dotted relative mr-2 h-full flex-grow rounded-lg bg-blue-50 transition-colors",
        {
          "dotted-dark bg-transparent": isShowcase,
        },
      )}
    >
      <AnimatePresence>
        {isShowcase && <ShowcaseHUD planetRef={planetRef.current!} />}
      </AnimatePresence>
      <div className="mx-auto h-full w-[calc(100vw_-_26rem)] overflow-hidden">
        <Canvas className="cursor-grab active:cursor-grabbing">
          <Renderer ref={planetRef} />
        </Canvas>
      </div>
      <AnimatePresence>{!isShowcase && <EditorHUD />}</AnimatePresence>
    </div>
  );
};

export default Editor;
