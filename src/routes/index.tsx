import Sidebar from "@/components/composed/sidebar";
import { AnimatePresence } from "framer-motion";
import cn from "@/lib/cn";
import { useAtomValue } from "jotai";
import { isShowcaseAtom } from "@/atoms/showcase";
import RenderingCanvas from "@/components/composed/rendering-canvas";

function App() {
  const isShowcase = useAtomValue(isShowcaseAtom);

  return (
    <main
      className={cn(
        "flex h-screen w-full select-none bg-blue-200 p-2 pr-0 transition-colors",
        {
          "bg-black": isShowcase,
        },
      )}
    >
      <RenderingCanvas />
      <AnimatePresence>{!isShowcase && <Sidebar />}</AnimatePresence>
    </main>
  );
}

export default App;
