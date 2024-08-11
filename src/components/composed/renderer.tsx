import Lights from "./lights";
import { StatsGl } from "@react-three/drei";
import PlanetGPU from "../planet-gpu/planet-gpu";
import { forwardRef } from "react";
import { isShowcaseAtom } from "@/atoms/showcase";
import { useAtomValue } from "jotai";
import Atmosphere from "../atmosphere/atmosphere";

import { useRef } from "react";
import { useEffect } from "react";

const Renderer = forwardRef((_, ref) => {
  const isShowcase = useAtomValue(isShowcaseAtom);

  return (
    <>
      <Lights />
      <PlanetGPU ref={ref} showcase={isShowcase} />
      {isShowcase && <Atmosphere />}
      {
        //  <StatsGl
        //   {...{
        //     logsPerSecond: 15,
        //     samplesLog: 100,
        //     samplesGraph: 10,
        //     precision: 2,
        //     horizontal: true,
        //     minimal: false,
        //     mode: 0,
        //   }}
        // />
      }
    </>
  );
});

export default Renderer;
