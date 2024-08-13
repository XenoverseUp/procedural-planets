import cn from "@/lib/cn";
import { AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { useAtomValue } from "jotai";
import { isShowcaseAtom } from "@/atoms/showcase";
import { useRef } from "react";
import { Mesh } from "three";
import { Perf } from "r3f-perf";
import Capture, { CaptureRef } from "../util/capture";
import ShowcaseHUD from "@/components/showcase/showcase-hud";
import Renderer from "@/components/editor/renderer";
import EditorHUD from "@/components/editor/editor-hud";
import { showsPerformanceAtom } from "@/atoms/settings";

const Editor = () => {
  const isShowcase = useAtomValue(isShowcaseAtom);
  const planetRef = useRef<Mesh>(null);
  const captureRef = useRef<CaptureRef>(null);
  const showsPerformance = useAtomValue(showsPerformanceAtom);

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
        {isShowcase && (
          <ShowcaseHUD
            capture={captureRef.current?.capture!}
            planetRef={planetRef.current!}
          />
        )}
      </AnimatePresence>
      <div className="mx-auto h-full w-[calc(100vw_-_26rem)] overflow-hidden">
        <Canvas className="cursor-grab active:cursor-grabbing">
          <Renderer ref={planetRef} />
          <Capture ref={captureRef} />
          {showsPerformance && <Perf position="top-left" />}
        </Canvas>
      </div>
      <AnimatePresence>{!isShowcase && <EditorHUD />}</AnimatePresence>
    </div>
  );
};

export default Editor;
