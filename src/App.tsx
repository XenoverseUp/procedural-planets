import { OrbitControls, Stats, Float } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Sidebar from "@/components/composed/sidebar";
import Planet from "@/components/planet/planet";
import Toolbar from "@/components/composed/toolbar";

function App() {
  return (
    <main className="flex h-screen w-full select-none gap-2 bg-blue-200 p-2">
      <div className="aaa relative h-full flex-grow items-center overflow-hidden rounded-lg bg-blue-50">
        <Toolbar className="absolute bottom-2 left-2 z-10" />
        <Canvas>
          <ambientLight intensity={0.75} />
          <directionalLight color="white" position={[0, 5, 5]} />
          <OrbitControls />
          <Float
            speed={5}
            rotationIntensity={0.5}
            floatIntensity={1}
            floatingRange={[-0.02, 0.02]}
          >
            <Planet />
          </Float>
          <Stats />
        </Canvas>
      </div>
      <Sidebar />
    </main>
  );
}

export default App;
