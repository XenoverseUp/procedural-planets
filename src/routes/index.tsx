import Lights from "@/components/composed/lights";
import Sidebar from "@/components/composed/sidebar";
import Toolbar from "@/components/composed/toolbar";
import Planet from "@/components/planet/planet";
import PlanetGPU from "@/components/planet-gpu/planet-gpu";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Float, OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Link } from "react-router-dom";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

function App() {
  const [isShowcase, setIsShowcase] = useState(false);

  return (
    <main className="flex h-screen w-full select-none bg-blue-200 p-2 pr-0">
      <div className="dotted relative mr-2 h-full flex-grow rounded-lg bg-blue-50">
        <div className="mx-auto h-full w-[calc(100vw_-_26rem)] overflow-hidden">
          <Toolbar className="absolute bottom-2 left-2 z-10" />
          <Canvas className="w-full">
            <Lights />
            <OrbitControls enableZoom={false} enablePan={false} />
            <Stats />
            {/* <Float
            speed={3}
            rotationIntensity={0.5}
            floatIntensity={1}
            floatingRange={[-0.02, 0.02]}
          >
          </Float> */}
            <PlanetGPU />
            {/* <Planet /> */}
          </Canvas>

          <button
            onClick={() => setIsShowcase((state) => !state)}
            className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 px-4 py-1 text-sm text-blue-900 hover:brightness-95"
          >
            <span>Finish</span>
            <PaperPlaneIcon />
          </button>
        </div>
      </div>

      <AnimatePresence>{!isShowcase && <Sidebar />}</AnimatePresence>
    </main>
  );
}

export default App;
