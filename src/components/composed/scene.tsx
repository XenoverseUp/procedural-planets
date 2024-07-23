import Lights from "./lights";
import { OrbitControls, Stats } from "@react-three/drei";
import PlanetGPU from "../planet-gpu/planet-gpu";
import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { isShowcaseAtom } from "@/atoms/showcase";
import { useAtom } from "jotai";
import Atmosphere from "../atmosphere/atmosphere";
import { useThree } from "@react-three/fiber";

const Scene = () => {
  const [isShowcase, setIsShowcase] = useAtom(isShowcaseAtom);

  return (
    <>
      <Lights />
      <PlanetGPU showcase={isShowcase} />
      <Atmosphere />

      {/* <Planet /> */}

      {/* <Stats /> */}
    </>
  );
};

export default Scene;
