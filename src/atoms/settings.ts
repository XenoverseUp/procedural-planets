import { atom } from "jotai";
import { Vector3 } from "three";
import { NoiseFilter } from "../util/noise";
import { VECTOR_ZERO } from "../util/vector";

export const meshResolutionAtom = atom(128);
export const planetRadiusAtom = atom(1.25);
export const isWireframeAtom = atom(false);

export const noiseFiltersAtom = atom<NoiseFilter[]>([
  new NoiseFilter({
    strength: 0.1,
    roughness: 2,
    baseRoughness: 0.71,
    center: VECTOR_ZERO,
    persistence: 0.5,
    minValue: 1.1,
    layerSize: 5,
  }),
]);
