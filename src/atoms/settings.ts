import { Vector4 } from "three";
import { atom } from "jotai";
import { SimpleNoiseFilter, NoiseFilter, RidgidNoiseFilter } from "@/lib/noise";
import { VECTOR_ZERO } from "@/lib/vector";
import GradientStop from "@/lib/gradient";

export const meshResolutionAtom = atom(256);
export const planetRadiusAtom = atom(2);

export const isBlendAtom = atom(true);

export const isWireframeAtom = atom(false);
export const rendersGlobeAtom = atom(true);

export const depthGradientAtom = atom<GradientStop[]>([
  new GradientStop({
    anchor: 0,
    color: new Vector4(0, 0, 0.6, 1),
  }),
  new GradientStop({
    anchor: 1,
    color: new Vector4(0.15, 0.55, 1, 1),
  }),
]);

export const elevationGradientAtom = atom<GradientStop[]>([
  new GradientStop({
    anchor: 0.0,
    color: new Vector4(0.639, 0.678, 0.237, 1),
  }),
  new GradientStop({
    anchor: 0.126,
    color: new Vector4(0.235, 0.718, 0.0306, 1),
  }),
  new GradientStop({
    anchor: 0.57,
    color: new Vector4(0.569, 0.357, 0.169, 1),
  }),
  new GradientStop({
    anchor: 0.9,
    color: new Vector4(0.47, 0.478, 0.46, 1),
  }),
  new GradientStop({
    anchor: 1,
    color: new Vector4(1, 1, 1, 1),
  }),
]);

export const noiseFiltersAtom = atom<NoiseFilter[]>([
  new SimpleNoiseFilter({
    enabled: true,
    strength: 0.2,
    roughness: 2.5,
    baseRoughness: 1.2,
    center: VECTOR_ZERO,
    persistence: 0.5,
    minValue: 1.1,
    layerCount: 10,
    useFirstLayerAsMask: false,
  }),
  new RidgidNoiseFilter({
    enabled: true,
    strength: 0.1,
    roughness: 2.5,
    baseRoughness: 0.95,
    center: VECTOR_ZERO,
    persistence: 0.5,
    minValue: 1.9,
    layerCount: 5,
  }),
]);
