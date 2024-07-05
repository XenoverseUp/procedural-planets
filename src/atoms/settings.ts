import { atom } from "jotai";
import { NoiseFilter } from "@/util/noise";
import { VECTOR_ZERO } from "@/util/vector";

export const meshResolutionAtom = atom(128);
export const planetRadiusAtom = atom(1.25);
export const isWireframeAtom = atom(false);
export const rendersGlobeAtom = atom(true);

export const noiseFiltersAtom = atom<NoiseFilter[]>([
  new NoiseFilter({
    strength: 0.2,
    roughness: 2.25,
    baseRoughness: 0.7,
    center: VECTOR_ZERO,
    persistence: 0.5,
    minValue: 1.1,
    layerCount: 5,
    enabled: true,
  }),
]);
