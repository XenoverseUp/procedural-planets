import PlanetGPU from "../planet-gpu/planet-gpu";
import { forwardRef } from "react";
import { isShowcaseAtom } from "@/atoms/showcase";
import { useAtomValue } from "jotai";
import Atmosphere from "../atmosphere/atmosphere";
import Lights from "@/components/editor/lights";

const Renderer = forwardRef((_, ref) => {
  const isShowcase = useAtomValue(isShowcaseAtom);

  return (
    <>
      <Lights />
      <PlanetGPU ref={ref} showcase={isShowcase} />
      {isShowcase && <Atmosphere />}
    </>
  );
});

export default Renderer;
