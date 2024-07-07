import { createNoise3D, NoiseFunction3D } from "simplex-noise";
import { Vector3 } from "three";
import { VECTOR_ZERO } from "./vector";

type int = number;
type float = number;

export interface NoiseFilter {
  enabled: boolean;
  evaluate: (p: Vector3) => float;
  strength: float;
  roughness: float;
  center: Vector3;
  baseRoughness: float;
  persistence: float;
  minValue: float;
  layerCount: int;
}

type SimpleNoiseFilterParameters = {
  enabled: boolean;
  strength?: float;
  roughness?: float;
  center?: Vector3;
  baseRoughness?: float;
  persistence?: float;
  minValue?: float;
  layerCount?: int;
};

type RidgidNoiseFilterParameters = {
  enabled: boolean;
  strength?: float;
  roughness?: float;
  center?: Vector3;
  baseRoughness?: float;
  persistence?: float;
  minValue?: float;
  layerCount?: int;
};

export class RidgidNoiseFilter implements NoiseFilter {
  strength: float;
  roughness: float;
  center: Vector3;
  persistence: float;
  baseRoughness: float;
  minValue: float;
  layerCount: int;
  enabled: boolean;

  #noise: NoiseFunction3D;

  constructor({
    strength = 1,
    roughness = 2,
    center = VECTOR_ZERO,
    persistence = 0.5,
    baseRoughness = 1,
    minValue = 1.22,
    layerCount = 1,
    enabled = true,
  }: RidgidNoiseFilterParameters) {
    this.strength = strength;
    this.roughness = roughness;
    this.center = center;
    this.persistence = persistence;
    this.baseRoughness = baseRoughness;
    this.minValue = minValue;
    this.layerCount = layerCount;
    this.enabled = enabled;

    this.#noise = createNoise3D();
  }

  #ridgidNoise = (point: Vector3): float => {
    let v: float = this.#noise(...point.toArray());
    v = Math.abs(v);
    v = 1 - v;
    v = v ** 2;

    return v;
  };

  evaluate = (point: Vector3): float => {
    let noise: float = 0;
    let frequency: float = this.baseRoughness;
    let amplitude: float = 1;
    let weight: float = 1;

    for (let i = 0; i < this.layerCount; i++) {
      const processedPoint = point
        .clone()
        .multiplyScalar(frequency)
        .add(this.center);

      let v: float = this.#ridgidNoise(processedPoint);

      v *= weight;
      weight = v;

      noise += v * amplitude;
      frequency *= this.roughness;
      amplitude *= this.persistence;
    }

    noise = Math.max(0, noise - this.minValue);

    return noise * this.strength;
  };
}

export class SimpleNoiseFilter implements NoiseFilter {
  strength: float;
  roughness: float;
  center: Vector3;
  persistence: float;
  baseRoughness: float;
  minValue: float;
  layerCount: int;
  enabled: boolean;

  #noise: NoiseFunction3D;

  constructor({
    strength = 1,
    roughness = 2,
    center = VECTOR_ZERO,
    persistence = 0.5,
    baseRoughness = 1,
    minValue = 1.22,
    layerCount = 1,
    enabled = true,
  }: SimpleNoiseFilterParameters) {
    this.strength = strength;
    this.roughness = roughness;
    this.center = center;
    this.persistence = persistence;
    this.baseRoughness = baseRoughness;
    this.minValue = minValue;
    this.layerCount = layerCount;
    this.enabled = enabled;

    this.#noise = createNoise3D();
  }

  evaluate = (point: Vector3): float => {
    let noise: float = 0;
    let frequency: float = this.baseRoughness;
    let amplitude: float = 1;

    for (let i = 0; i < this.layerCount; i++) {
      const processedPoint = point
        .clone()
        .multiplyScalar(frequency)
        .add(this.center);

      noise += (this.#noise(...processedPoint.toArray()) + 1) * 0.5 * amplitude;
      frequency *= this.roughness;
      amplitude *= this.persistence;
    }

    noise = Math.max(0, noise - this.minValue);

    return noise * this.strength;
  };
}
