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
import logo from "@/assets/img/logo.svg";

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
      <div className="absolute left-4 top-4 flex items-center gap-2">
        <svg
          className={cn("size-6 fill-blue-100 stroke-blue-400", {
            "fill-blue-400 stroke-none": isShowcase,
          })}
          viewBox="0 0 84 83"
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth={4}
        >
          <path d="M71.4357 12.4144C79.3054 20.2841 83.0379 30.7233 82.6329 41.0328C82.1386 41.0522 81.644 41.0621 81.1493 41.0625C81.1308 41.0625 81.1123 41.0625 81.0938 41.0625C71.2912 41.0563 61.4927 37.3139 54.0145 29.8356C46.1448 21.9659 42.4123 11.5267 42.8173 1.21723C53.1268 0.812181 63.566 4.54468 71.4357 12.4144ZM30.1857 29.8356C22.7092 37.3121 12.9136 41.0545 3.11334 41.0625C3.09449 41.0625 3.07565 41.0625 3.0568 41.0625C2.56021 41.0622 2.06362 41.0523 1.56733 41.0328C1.16228 30.7233 4.89478 20.2841 12.7645 12.4144C20.6342 4.54468 31.0734 0.812181 41.3829 1.21723C41.7879 11.5267 38.0554 21.9659 30.1857 29.8356ZM3.0568 42.4375C3.07334 42.4375 3.08987 42.4375 3.10641 42.4375C12.909 42.4437 22.7075 46.1861 30.1857 53.6644C38.0554 61.5341 41.7879 71.9733 41.3829 82.2828C31.0734 82.6878 20.6342 78.9553 12.7645 71.0856C4.89478 63.2159 1.16228 52.7767 1.56733 42.4672C2.06362 42.4477 2.56021 42.4378 3.0568 42.4375ZM81.1434 42.4375C81.64 42.4378 82.1366 42.4477 82.6329 42.4672C83.0379 52.7767 79.3054 63.2159 71.4357 71.0856C63.566 78.9553 53.1268 82.6878 42.8173 82.2828C42.4123 71.9733 46.1448 61.5341 54.0145 53.6644C61.4927 46.1861 71.2912 42.4437 81.0938 42.4375C81.1103 42.4375 81.1269 42.4375 81.1434 42.4375Z" />
        </svg>
      </div>
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
