import MinMax from "@/lib/min-max";
import { NoiseFilter, SimpleNoiseFilter } from "@/lib/noise";
import { Vector2, Vector3 } from "three";

type generateTerrainParams = {
  resolution: number;
  localUp: Vector3;
  noiseFilters: NoiseFilter[];
};

const generateTerrain = ({
  resolution,

  localUp,
  noiseFilters,
}: generateTerrainParams) => {
  let vertices: Float32Array = new Float32Array(resolution ** 2 * 3);
  let indices: Uint32Array = new Uint32Array((resolution - 1) ** 2 * 6);
  const axisA = new Vector3(localUp.y, localUp.z, localUp.x);
  const axisB = new Vector3().crossVectors(axisA, localUp);

  const elevationMinMax = new MinMax();

  let index = 0;
  let triangleIndex = 0;

  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      const percentX = x / (resolution - 1);
      const percentY = y / (resolution - 1);

      const pointOnCube = new Vector3(0, 0, 0)
        .add(localUp)
        .addScaledVector(axisA, (percentX - 0.5) * 2)
        .addScaledVector(axisB, (percentY - 0.5) * 2);

      const pointOnUnitSphere = pointOnCube.normalize();

      let mask = noiseFilters.at(0)?.evaluate(pointOnUnitSphere) ?? 0;
      let elevation = mask;

      for (let i = 1; i < noiseFilters.length; i++) {
        if (!noiseFilters.at(i)?.enabled) continue;
        elevation +=
          noiseFilters.at(i)!.evaluate(pointOnUnitSphere) * mask ?? 0;
      }

      const pointOnPlanet = pointOnUnitSphere.multiplyScalar(1 + elevation);
      elevationMinMax.add(pointOnPlanet.length());

      vertices[index] = pointOnPlanet.x;
      vertices[index + 1] = pointOnPlanet.y;
      vertices[index + 2] = pointOnPlanet.z;
      index += 3;

      if (x !== resolution - 1 && y !== resolution - 1) {
        const i = x + y * resolution;
        indices[triangleIndex] = i + resolution + 1;
        indices[triangleIndex + 1] = i + 1;
        indices[triangleIndex + 2] = i;
        indices[triangleIndex + 3] = i + resolution;
        indices[triangleIndex + 4] = i + resolution + 1;
        indices[triangleIndex + 5] = i;
        triangleIndex += 6;
      }
    }
  }

  return {
    vertices,
    indices,
    elevationMinMax,
  };
};

export default generateTerrain;
