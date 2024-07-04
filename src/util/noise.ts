import { createNoise3D, NoiseFunction3D } from "simplex-noise";
import { Vector3 } from "three";

export class NoiseFilter {
  #strength: number;
  #roughness: number;
  #center: Vector3;
  #noise: NoiseFunction3D;

  constructor(strength: number, roughness: number, center: Vector3) {
    this.#strength = strength;
    this.#roughness = roughness;
    this.#center = center;
    this.#noise = createNoise3D();
  }

  evaluate = (point: Vector3): number => {
    const processedPoint = point
      .clone()
      .multiplyScalar(this.#roughness)
      .add(this.#center);

    const simplex =
      (this.#noise(processedPoint.x, processedPoint.y, processedPoint.z) + 1) /
      2;

    return simplex * this.#strength;
  };
}
