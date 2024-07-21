import { Canvas, useFrame } from "@react-three/fiber";
import Lights from "./lights";
import { OrbitControls, Stats } from "@react-three/drei";
import PlanetGPU from "../planet-gpu/planet-gpu";
import { useRef } from "react";
import { Mesh } from "three";
import { isShowcaseAtom } from "@/atoms/showcase";
import { useAtom } from "jotai";
import Atmosphere from "../atmosphere/atmosphere";

const Scene = () => {
  const [isShowcase, setIsShowcase] = useAtom(isShowcaseAtom);
  const planetRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (isShowcase) {
      planetRef.current?.rotateY(0.005);
    }
  });

  return (
    <>
      <Lights />
      <OrbitControls enableZoom={false} enablePan={false} />

      <PlanetGPU ref={planetRef} />
      <Atmosphere />

      {/* <Planet /> */}

      {/* <Stats /> */}
    </>
  );
};

export default Scene;
