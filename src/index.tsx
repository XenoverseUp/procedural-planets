import Sidebar from "@/components/ui/sidebar";
import { AnimatePresence } from "framer-motion";
import cn from "@/lib/cn";
import { useAtomValue } from "jotai";
import { isShowcaseAtom } from "@/atoms/showcase";
import Editor from "@/components/editor/editor";
import useIsMobile from "@/hooks/useIsMobile";
import useMediaQuery from "./hooks/useMediaQuery";
import UIBlocker from "@/components/ui/ui-blocker";

function App() {
  const isMobile = useIsMobile();
  const isWide = useMediaQuery("(min-width: 864px)");
  const isShowcase = useAtomValue(isShowcaseAtom);

  if (isMobile)
    return (
      <UIBlocker description="Please use a desktop browser to craft planets." />
    );

  if (!isWide)
    return (
      <UIBlocker description="Screen width is not enough to use the tool properly. Try using a wider screen." />
    );

  return (
    <main
      className={cn(
        "flex h-screen w-full select-none bg-blue-200 p-2 pr-0 transition-colors",
        {
          "bg-black": isShowcase,
        },
      )}
    >
      <Editor />
      <AnimatePresence>{!isShowcase && <Sidebar />}</AnimatePresence>
    </main>
  );
}

export default App;
