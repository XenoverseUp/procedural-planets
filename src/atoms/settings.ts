import { atom } from "jotai";
import { SimpleNoiseFilter, NoiseFilter, RidgidNoiseFilter } from "@/lib/noise";
import { VECTOR_ZERO } from "@/lib/vector";

export const meshResolutionAtom = atom(72);
export const planetRadiusAtom = atom(1.25);
export const isWireframeAtom = atom(false);
export const rendersGlobeAtom = atom(true);

export const noiseFiltersAtom = atom<NoiseFilter[]>([
  new SimpleNoiseFilter({
    enabled: true,
    strength: 0.2,
    roughness: 2.25,
    baseRoughness: 0.7,
    center: VECTOR_ZERO,
    persistence: 0.5,
    minValue: 1.1,
    layerCount: 5,
  }),
  new RidgidNoiseFilter({
    enabled: true,
    strength: 0.1,
    roughness: 2.25,
    baseRoughness: 0.7,
    center: VECTOR_ZERO,
    persistence: 0.5,
    minValue: 1.1,
    layerCount: 5,
  }),
]);
