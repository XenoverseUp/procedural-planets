import Lights from "./lights";
import { OrbitControls, Stats } from "@react-three/drei";
import PlanetGPU from "../planet-gpu/planet-gpu";
import { forwardRef, useEffect, useRef } from "react";
import { Mesh } from "three";
import { isShowcaseAtom } from "@/atoms/showcase";
import { useAtom, useAtomValue } from "jotai";
import Atmosphere from "../atmosphere/atmosphere";

const Scene = forwardRef((_, ref) => {
  const isShowcase = useAtomValue(isShowcaseAtom);

  return (
    <>
      <Lights />
      <PlanetGPU ref={ref} showcase={isShowcase} />
      {isShowcase && <Atmosphere />}

      {/* <Planet /> */}
      {/* <Stats /> */}
    </>
  );
});

export default Scene;
