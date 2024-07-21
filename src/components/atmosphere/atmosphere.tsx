import vs from "@/glsl/atmosphere/atmosphere.vs?raw";
import fs from "@/glsl/atmosphere/atmosphere.fs?raw";
import { AdditiveBlending, BackSide, ShaderMaterial, Uniform } from "three";
import { useAtomValue } from "jotai";
import { planetRadiusAtom } from "@/atoms/settings";
import { useLayoutEffect, useRef } from "react";

const Atmosphere = () => {
  const radius = useAtomValue(planetRadiusAtom);
  const shaderRef = useRef<ShaderMaterial>(null);

  useLayoutEffect(() => {
    if (!shaderRef.current) return;

    shaderRef.current.uniforms.uRadius = new Uniform(radius);
  }, [radius]);

  return (
    <mesh>
      <sphereGeometry />
      <shaderMaterial
        vertexShader={vs}
        fragmentShader={fs}
        blending={AdditiveBlending}
        side={BackSide}
        ref={shaderRef}
      />
    </mesh>
  );
};

export default Atmosphere;
