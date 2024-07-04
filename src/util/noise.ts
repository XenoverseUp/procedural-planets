import { createNoise3D, NoiseFunction3D } from "simplex-noise";
import { Vector3 } from "three";
import { VECTOR_ZERO } from "./vector";

type int = number;
type float = number;

type NoiseFilterParameters = {
  strength?: float;
  roughness?: float;
  center?: Vector3;
  baseRoughness?: float;
  persistence?: float;
  minValue?: float;
  layerSize?: int;
};

export class NoiseFilter {
  #strength: float;
  #roughness: float;
  #center: Vector3;
  #persistence: float;
  #baseRoughness: float;
  #minValue: float;
  #layerSize: int;

  #noise: NoiseFunction3D;

  constructor({
    strength = 1,
    roughness = 2,
    center = VECTOR_ZERO,
    persistence = 0.5,
    baseRoughness = 1,
    minValue = 1.22,
    layerSize = 1,
  }: NoiseFilterParameters) {
    this.#strength = strength;
    this.#roughness = roughness;
    this.#center = center;
    this.#persistence = persistence;
    this.#baseRoughness = baseRoughness;
    this.#minValue = minValue;
    this.#layerSize = layerSize;

    this.#noise = createNoise3D();
  }

  evaluate = (point: Vector3): float => {
    let noise: float = 0;
    let frequency: float = this.#baseRoughness;
    let amplitude: float = 1;

    for (let i = 0; i < this.#layerSize; i++) {
      const processedPoint = point
        .clone()
        .multiplyScalar(frequency)
        .add(this.#center);

      noise += (this.#noise(...processedPoint.toArray()) + 1) * 0.5 * amplitude;
      frequency *= this.#roughness;
      amplitude *= this.#persistence;
    }

    noise = Math.max(0, noise - this.#minValue);

    return noise * this.#strength;
  };
}
