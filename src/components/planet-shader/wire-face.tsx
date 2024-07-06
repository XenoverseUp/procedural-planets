import { useEffect, useLayoutEffect, useRef } from "react";
import { BufferAttribute, BufferGeometry, Mesh, Vector2, Vector3 } from "three";
import { useAtomValue } from "jotai";
import { noiseFiltersAtom } from "@/atoms/settings";

type WireFaceProps = {
  resolution: number;
  localUp: Vector3;
  radius?: number;
};

const WireFace = ({ resolution, localUp, radius = 1 }: WireFaceProps) => {
  const meshRef = useRef<Mesh>(null);
  const axisA = useRef<Vector3 | null>(null);
  const axisB = useRef<Vector3 | null>(null);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    axisA.current = new Vector3(localUp.y, localUp.z, localUp.x);
    axisB.current = new Vector3().crossVectors(axisA.current, localUp);
  }, []);

  useEffect(() => {
    const vertices: Float32Array = new Float32Array(resolution ** 2 * 3);
    const triangles: Uint32Array = new Uint32Array((resolution - 1) ** 2 * 6);

    let index = 0;
    let triangleIndex = 0;

    for (let y = 0; y < resolution; y++) {
      for (let x = 0; x < resolution; x++) {
        const percent = new Vector2(x, y).divideScalar(resolution - 1);

        const pointOnCube = new Vector3(0, 0, 0)
          .add(localUp)
          .addScaledVector(axisA.current as Vector3, (percent.x - 0.5) * 2)
          .addScaledVector(axisB.current as Vector3, (percent.y - 0.5) * 2);

        const pointOnSphere = pointOnCube
          .clone()
          .normalize()
          .multiplyScalar(radius);

        vertices[index] = pointOnSphere.x;
        vertices[index + 1] = pointOnSphere.y;
        vertices[index + 2] = pointOnSphere.z;
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

    if (meshRef.current) {
      const oldGeometry = meshRef.current.geometry;
      meshRef.current.geometry = geometry;
      if (oldGeometry) oldGeometry.dispose();
    }

    return () => {
      geometry.dispose();
      meshRef.current?.geometry.dispose();
    };
  }, [radius]);

  return (
    <mesh ref={meshRef}>
      <bufferGeometry />
      {/* <meshPhongMaterial specular="white" color="white" {...{ wireframe }} /> */}
      {/* <meshToonMaterial color="lightblue" /> */}
      <meshBasicMaterial color="lightblue" wireframe />
    </mesh>
  );
};

export default WireFace;
