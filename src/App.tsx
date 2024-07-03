import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Terrain from "./components/Terrain";
import Sidebar from "./components/sidebar";

function App() {
  return (
    <main className="flex h-screen w-full gap-2 bg-blue-200 p-2">
      <div className="h-full flex-grow items-center overflow-hidden rounded-lg bg-green-50">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight color="white" position={[0, 5, 5]} />
          <Terrain />
          <OrbitControls />
        </Canvas>
      </div>
      <Sidebar />
    </main>
  );
}

export default App;
