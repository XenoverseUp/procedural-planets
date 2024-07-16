import MinMax from "@/lib/min-max";
import { NoiseFilter } from "@/lib/noise";
import spherize from "@/lib/spherize";
import { Vector3 } from "three";

type MeshGeneratorParams = {
  resolution: number;
  localUp: Vector3;
  noiseFilters: NoiseFilter[];
};

class MeshGenerator {
  resolution: GLint;
  localUp: Vector3;
  noiseFilters: NoiseFilter[];

  constructor({ resolution, localUp, noiseFilters }: MeshGeneratorParams) {
    this.resolution = resolution;
    this.localUp = localUp;
    this.noiseFilters = noiseFilters;
  }

  generateTerrain = () => {
    let vertices: Float32Array = new Float32Array(this.resolution ** 2 * 3);
    let indices: Uint32Array = new Uint32Array((this.resolution - 1) ** 2 * 6);
    let uv = new Float32Array(this.resolution ** 2 * 2);

    const axisA = new Vector3(this.localUp.y, this.localUp.z, this.localUp.x);
    const axisB = new Vector3().crossVectors(axisA, this.localUp);

    const elevationMinMax = new MinMax();

    let index = 0;
    let triangleIndex = 0;

    for (let y = 0; y < this.resolution; y++) {
      for (let x = 0; x < this.resolution; x++) {
        const i = x + y * this.resolution;

        const percentX = x / (this.resolution - 1);
        const percentY = y / (this.resolution - 1);

        const pointOnCube = new Vector3(0, 0, 0)
          .add(this.localUp)
          .addScaledVector(axisA, (percentX - 0.5) * 2)
          .addScaledVector(axisB, (percentY - 0.5) * 2);

        const pointOnUnitSphere = spherize(pointOnCube);

        const unscaledElevation =
          this.calculateUnscaledElevation(pointOnUnitSphere);

        const elevation = this.getScaledElevation(unscaledElevation);

        elevationMinMax.add(unscaledElevation + 1);

        const pointOnPlanet = pointOnUnitSphere.multiplyScalar(1 + elevation);

        vertices[index] = pointOnPlanet.x;
        vertices[index + 1] = pointOnPlanet.y;
        vertices[index + 2] = pointOnPlanet.z;
        index += 3;

        uv[i * 2] = 1 + unscaledElevation;
        uv[i * 2 + 1] = 0;

        if (x !== this.resolution - 1 && y !== this.resolution - 1) {
          const i = x + y * this.resolution;
          indices[triangleIndex] = i + this.resolution + 1;
          indices[triangleIndex + 1] = i + 1;
          indices[triangleIndex + 2] = i;
          indices[triangleIndex + 3] = i + this.resolution;
          indices[triangleIndex + 4] = i + this.resolution + 1;
          indices[triangleIndex + 5] = i;
          triangleIndex += 6;
        }
      }
    }

    return {
      vertices,
      indices,
      uv,
      elevationMinMax,
    };
  };

  calculateUnscaledElevation = (pointOnUnitSphere: Vector3): GLfloat => {
    let elevation = 0;
    let mask = this.noiseFilters.at(0)?.evaluate(pointOnUnitSphere) ?? 0;
    mask = Math.max(0, mask);

    let depthCaptured = false;
    let depth: number;

    for (let i = 0; i < this.noiseFilters.length; i++) {
      if (!this.noiseFilters.at(i)?.enabled) continue;

      let noiseValue =
        this.noiseFilters.at(i)?.evaluateUnscaled(pointOnUnitSphere) ?? 0;

      if (this.noiseFilters.at(i)?.useFirstLayerAsMask) noiseValue *= mask * 7;

      elevation += depthCaptured ? Math.max(0, noiseValue) : noiseValue;

      if (!depthCaptured) depthCaptured = true;
    }

    return elevation;
  };

  getScaledElevation = (unscaledElevation: GLfloat): GLfloat => {
    return Math.max(0, unscaledElevation);
  };
}

export default MeshGenerator;
