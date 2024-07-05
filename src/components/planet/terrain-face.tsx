import { useEffect, useLayoutEffect, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  FrontSide,
  Mesh,
  Vector2,
  Vector3,
} from "three";
import { useAtomValue } from "jotai";
import { noiseFiltersAtom } from "@/atoms/settings";
import { generateTerrain, memory } from "@/assembly/build/release";

type TerrainFaceProps = {
  resolution: number;
  localUp: Vector3;
  wireframe?: boolean;
  radius?: number;
  renderBackface?: boolean;
};

const TerrainFace = ({
  resolution,
  localUp,
  wireframe,
  radius = 1,
  renderBackface = false,
}: TerrainFaceProps) => {
  const meshRef = useRef<Mesh>(null);
  const axisA = useRef<Vector3 | null>(null);
  const axisB = useRef<Vector3 | null>(null);
  const noiseFilters = useAtomValue(noiseFiltersAtom);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    axisA.current = new Vector3(localUp.y, localUp.z, localUp.x);
    axisB.current = new Vector3().crossVectors(axisA.current, localUp);
  }, []);

  useEffect(() => {
    const vertices: Float32Array = new Float32Array(resolution ** 2 * 3);
    const triangles: Uint32Array = new Uint32Array((resolution - 1) ** 2 * 6);

    const pointer = generateTerrain(resolution);
    const data = new Uint32Array(memory.buffer, pointer, 2);
    const vertexPointer = data[0];
    const indexPointer = data[1];

    const vertexLength = resolution; //resolution ** 2 * 3;
    const verticess = new Float32Array(
      memory.buffer,
      vertexPointer,
      vertexLength,
    );

    const indicesLength = resolution; //(resolution - 1) ** 2 * 6;
    const triangless = new Uint16Array(
      memory.buffer,
      indexPointer,
      indicesLength,
    );

    console.log({ verticess, triangless });

    let index = 0;
    let triangleIndex = 0;

    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const percent = new Vector2(x, y).divideScalar(resolution - 1);

        const pointOnCube = new Vector3(0, 0, 0)
          .add(localUp)
          .addScaledVector(axisA.current as Vector3, (percent.x - 0.5) * 2)
          .addScaledVector(axisB.current as Vector3, (percent.y - 0.5) * 2);

        const pointOnUnitSphere = pointOnCube.clone().normalize();

        let elevation = 0;

        for (let i = 0; i < noiseFilters.length; i++) {
          if (!noiseFilters.at(i)?.enabled) continue;
          elevation += noiseFilters.at(i)?.evaluate(pointOnUnitSphere) ?? 0;
        }

        const pointOnPlanet = pointOnUnitSphere
          .clone()
          .multiplyScalar(radius)
          .multiplyScalar(1 + elevation);

        vertices[index] = pointOnPlanet.x;
        vertices[index + 1] = pointOnPlanet.y;
        vertices[index + 2] = pointOnPlanet.z;
        index += 3;

        if (x !== resolution - 1 && y !== resolution - 1) {
          const i = x + y * resolution;
          triangles[triangleIndex] = i + resolution + 1;
          triangles[triangleIndex + 1] = i + 1;
          triangles[triangleIndex + 2] = i;
          triangles[triangleIndex + 3] = i + resolution;
          triangles[triangleIndex + 4] = i + resolution + 1;
          triangles[triangleIndex + 5] = i;
          triangleIndex += 6;
        }
      }
    }

    meshRef.current?.clear();

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(vertices, 3));
    geometry.setIndex(new BufferAttribute(triangles, 1));

    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();

    meshRef.current!.geometry = geometry;
  }, [resolution, localUp, radius, noiseFilters]);

  return (
    <mesh ref={meshRef}>
      <bufferGeometry />
      <meshPhongMaterial
        specular="white"
        color="white"
        {...{ wireframe }}
        side={renderBackface ? DoubleSide : FrontSide}
      />
      {/* <meshToonMaterial color="lightblue" /> */}
      <meshNormalMaterial
        {...{ wireframe }}
        side={renderBackface ? DoubleSide : FrontSide}
      />
    </mesh>
  );
};

export default TerrainFace;
