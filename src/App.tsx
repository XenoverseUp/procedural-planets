import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Terrain from "./components/Terrain";
import Sidebar from "./components/sidebar";
import Planet from "./components/planet/planet";
import Toolbar from "./components/composed/toolbar";

function App() {
  return (
    <main className="flex h-screen w-full gap-2 bg-blue-200 p-2">
      <div className="aaa relative h-full flex-grow items-center overflow-hidden rounded-lg bg-blue-50">
        <Toolbar className="absolute left-2 top-2 z-10" />
        <Canvas>
          <ambientLight intensity={0.75} />
          <directionalLight color="white" position={[5, -5, 5]} />
          {/* <Terrain /> */}
          <Planet />
          <OrbitControls />
        </Canvas>
      </div>
      <Sidebar />
    </main>
  );
}

export default App;
