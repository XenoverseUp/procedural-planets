import { atom } from "jotai";
import { Vector3 } from "three";
import { NoiseFilter } from "../util/noise";
import { VECTOR_ZERO } from "../util/vector";

export const meshResolutionAtom = atom(72);
export const planetRadiusAtom = atom(1.25);
export const isWireframeAtom = atom(false);

export const noiseFiltersAtom = atom<NoiseFilter[]>([
  new NoiseFilter(0.5, 1, VECTOR_ZERO),
]);
