import { atom } from "jotai";

type Layer = {
  amplitude: number;
};

export const layerCountAtom = atom(1);

export const firstLayerAtom = atom<Layer>({
  amplitude: 0.5,
});

export const secondLayerAtom = atom<Layer>({
  amplitude: 1,
});

export const thirdLayerAtom = atom<Layer>({
  amplitude: 1,
});

export const fourthLayerAtom = atom<Layer>({
  amplitude: 1,
});
