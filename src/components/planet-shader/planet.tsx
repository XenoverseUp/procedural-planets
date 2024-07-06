import {
  VECTOR_BACK,
  VECTOR_DOWN,
  VECTOR_FRONT,
  VECTOR_LEFT,
  VECTOR_RIGHT,
  VECTOR_UP,
} from "@/lib/vector";
import { useAtomValue } from "jotai";
import {
  isWireframeAtom,
  meshResolutionAtom,
  noiseFiltersAtom,
  planetRadiusAtom,
  rendersGlobeAtom,
} from "@/atoms/settings";

import vs from "@/glsl/terrain.vs?raw";
import fs from "@/glsl/terrain.fs?raw";
import { useLayoutEffect, useRef } from "react";
import { GLSL3, ShaderMaterial } from "three";
import { SimpleNoiseFilter } from "@/lib/noise";

const Planet = () => {
  const meshResolution = useAtomValue(meshResolutionAtom);
  const isWireframe = useAtomValue(isWireframeAtom);
  const planetRadius = useAtomValue(planetRadiusAtom);
  const rendersGlobe = useAtomValue(rendersGlobeAtom);
  const noiseFilters = useAtomValue(noiseFiltersAtom);

  const shaderRef = useRef<ShaderMaterial>(null);

  useLayoutEffect(() => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uRadius = {
      value: planetRadius,
    };

    shaderRef.current.uniforms.uResolution = {
      value: meshResolution,
    };

    shaderRef.current.uniforms.uStrength = {
      value: (noiseFilters.at(0) as SimpleNoiseFilter).strength,
    };

    shaderRef.current.uniforms.uBaseRoughness = {
      value: (noiseFilters.at(0) as SimpleNoiseFilter).baseRoughness,
    };

    shaderRef.current.uniforms.uLayerCount = {
      value: (noiseFilters.at(0) as SimpleNoiseFilter).layerCount,
    };

    shaderRef.current.uniforms.uRoughness = {
      value: (noiseFilters.at(0) as SimpleNoiseFilter).roughness,
    };

    shaderRef.current.uniforms.uPersistence = {
      value: (noiseFilters.at(0) as SimpleNoiseFilter).persistence,
    };

    shaderRef.current.uniforms.uMinValue = {
      value: (noiseFilters.at(0) as SimpleNoiseFilter).minValue,
    };
  }, [planetRadius, noiseFilters]);

  return (
    <mesh>
      <icosahedronGeometry args={[1, meshResolution / 2]} />
      <shaderMaterial ref={shaderRef} vertexShader={vs} fragmentShader={fs} />
    </mesh>
  );
};

export default Planet;
