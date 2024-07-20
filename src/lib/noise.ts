import { createNoise3D, NoiseFunction3D } from "simplex-noise";
import { Vector3 } from "three";
import { VECTOR_ZERO } from "./vector";

type GLint = number;

enum NoiseType {
  Simple = 0,
  Ridgid = 1,
}

export interface NoiseFilter {
  enabled: boolean;
  evaluate: (p: Vector3) => GLfloat;
  evaluateUnscaled: (p: Vector3) => GLfloat;
  strength: GLfloat;
  roughness: GLfloat;
  center: Vector3;
  baseRoughness: GLfloat;
  persistence: GLfloat;
  minValue: GLfloat;
  layerCount: GLint;
  useFirstLayerAsMask: boolean;
  filterType: NoiseType;
}

type SimpleNoiseFilterParameters = {
  enabled: boolean;
  strength?: GLfloat;
  roughness?: GLfloat;
  center?: Vector3;
  baseRoughness?: GLfloat;
  persistence?: GLfloat;
  minValue?: GLfloat;
  layerCount?: GLint;
  useFirstLayerAsMask?: boolean;
};

type RidgidNoiseFilterParameters = {
  enabled: boolean;
  strength?: GLfloat;
  roughness?: GLfloat;
  center?: Vector3;
  baseRoughness?: GLfloat;
  persistence?: GLfloat;
  minValue?: GLfloat;
  layerCount?: GLint;
  useFirstLayerAsMask?: boolean;
};

export class RidgidNoiseFilter implements NoiseFilter {
  strength: GLfloat;
  roughness: GLfloat;
  center: Vector3;
  persistence: GLfloat;
  baseRoughness: GLfloat;
  minValue: GLfloat;
  layerCount: GLint;
  enabled: boolean;
  useFirstLayerAsMask: boolean;
  filterType: NoiseType = NoiseType.Ridgid;

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
    useFirstLayerAsMask = true,
  }: RidgidNoiseFilterParameters) {
    this.strength = strength;
    this.roughness = roughness;
    this.center = center;
    this.persistence = persistence;
    this.baseRoughness = baseRoughness;
    this.minValue = minValue;
    this.layerCount = layerCount;
    this.enabled = enabled;
    this.useFirstLayerAsMask = useFirstLayerAsMask;

    this.#noise = createNoise3D();
  }

  #ridgidNoise = (point: Vector3): GLfloat => {
    let v: GLfloat = this.#noise(...point.toArray());
    v = Math.abs(v);
    v = 1 - v;
    v = v ** 2;

    return v;
  };

  evaluateUnscaled = (point: Vector3): GLfloat => {
    let noise: GLfloat = 0;
    let frequency: GLfloat = this.baseRoughness;
    let amplitude: GLfloat = 1;
    let weight: GLfloat = 1;

    for (let i = 0; i < this.layerCount; i++) {
      const processedPoint = point
        .clone()
        .multiplyScalar(frequency)
        .add(this.center);

      let v: GLfloat = this.#ridgidNoise(processedPoint);

      v *= weight;
      weight = v;

      noise += v * amplitude;
      frequency *= this.roughness;
      amplitude *= this.persistence;
    }

    noise = noise - this.minValue;

    return noise * this.strength;
  };

  evaluate = (point: Vector3): GLfloat => {
    let noise: GLfloat = 0;
    let frequency: GLfloat = this.baseRoughness;
    let amplitude: GLfloat = 1;
    let weight: GLfloat = 1;

    for (let i = 0; i < this.layerCount; i++) {
      const processedPoint = point
        .clone()
        .multiplyScalar(frequency)
        .add(this.center);

      let v: GLfloat = this.#ridgidNoise(processedPoint);

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
  strength: GLfloat;
  roughness: GLfloat;
  center: Vector3;
  persistence: GLfloat;
  baseRoughness: GLfloat;
  minValue: GLfloat;
  layerCount: GLint;
  enabled: boolean;
  useFirstLayerAsMask: boolean;
  filterType: NoiseType = NoiseType.Simple;

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
    useFirstLayerAsMask = true,
  }: SimpleNoiseFilterParameters) {
    this.strength = strength;
    this.roughness = roughness;
    this.center = center;
    this.persistence = persistence;
    this.baseRoughness = baseRoughness;
    this.minValue = minValue;
    this.layerCount = layerCount;
    this.enabled = enabled;
    this.useFirstLayerAsMask = useFirstLayerAsMask;

    this.#noise = createNoise3D();
  }

  evaluateUnscaled = (point: Vector3): GLfloat => {
    let noise: GLfloat = 0;
    let frequency: GLfloat = this.baseRoughness;
    let amplitude: GLfloat = 1;

    for (let i = 0; i < this.layerCount; i++) {
      const processedPoint = point
        .clone()
        .multiplyScalar(frequency)
        .add(this.center);

      noise += (this.#noise(...processedPoint.toArray()) + 1) * 0.5 * amplitude;
      frequency *= this.roughness;
      amplitude *= this.persistence;
    }

    noise = noise - this.minValue;

    return noise * this.strength;
  };

  evaluate = (point: Vector3): GLfloat => {
    let noise: GLfloat = 0;
    let frequency: GLfloat = this.baseRoughness;
    let amplitude: GLfloat = 1;

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
