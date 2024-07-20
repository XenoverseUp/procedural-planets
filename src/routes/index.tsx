import Lights from "@/components/composed/lights";
import Sidebar from "@/components/composed/sidebar";
import Toolbar from "@/components/composed/toolbar";
import Planet from "@/components/planet/planet";
import PlanetGPU from "@/components/planet-gpu/planet-gpu";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import { Float, OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Link } from "react-router-dom";

function App() {
  return (
    <main className="flex h-screen w-full select-none gap-2 bg-blue-200 p-2">
      <div className="dotted relative h-full flex-grow items-center overflow-hidden rounded-lg bg-blue-50">
        <Toolbar className="absolute bottom-2 left-2 z-10" />
        <Canvas>
          <Lights />
          <OrbitControls enableZoom={true} enablePan={false} />
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

        <Link
          to="/showcase"
          className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 px-4 py-1 text-sm text-blue-900 hover:brightness-95"
        >
          <span>Finish</span>
          <PaperPlaneIcon />
        </Link>
      </div>
      <Sidebar />
    </main>
  );
}

export default App;
