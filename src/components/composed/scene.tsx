import Lights from "./lights";
import { OrbitControls, Stats } from "@react-three/drei";
import PlanetGPU from "../planet-gpu/planet-gpu";
import { useEffect, useRef } from "react";
import { Mesh } from "three";
import { isShowcaseAtom } from "@/atoms/showcase";
import { useAtom, useAtomValue } from "jotai";
import Atmosphere from "../atmosphere/atmosphere";

const Scene = () => {
  const isShowcase = useAtomValue(isShowcaseAtom);

  return (
    <>
      <Lights />
      <PlanetGPU showcase={isShowcase} />
      {isShowcase && <Atmosphere />}

      {/* <Planet /> */}
      {/* <Stats /> */}
    </>
  );
};

export default Scene;
