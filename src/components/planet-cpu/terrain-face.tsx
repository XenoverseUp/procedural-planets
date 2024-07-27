import { useAtom, useAtomValue } from "jotai";
import { startTransition, useLayoutEffect, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  FrontSide,
  Mesh,
  MeshPhysicalMaterial,
  ShaderMaterial,
  Uniform,
  Vector2,
  Vector3,
  Vector4,
} from "three";
import CustomShaderMaterial from "three-custom-shader-material";

import {
  depthGradientAtom,
  elevationGradientAtom,
  noiseFiltersAtom,
} from "@/atoms/settings";
import MeshGenerator from "@/components/planet/mesh-generation";

import { maximumAtom, minimumAtom } from "@/atoms/minMax";
import { extend, useFrame, useThree } from "@react-three/fiber";

import planetFragment from "@/glsl/planet/planet.fs?raw";
import planetVertex from "@/glsl/planet/planet.vs?raw";

extend({ CustomShaderMaterial });

const MAX_GRADIENT_SIZE: GLuint = 10;

type TerrainFaceProps = {
  resolution: number;
  localUp: Vector3;
  wireframe?: boolean;
  radius?: number;
  renderBackface?: boolean;
  isBlend?: boolean;
};

const TerrainFace = ({
  resolution,
  localUp,
  wireframe,
  radius = 1,
  isBlend = false,
  renderBackface = false,
}: TerrainFaceProps) => {
  const meshRef = useRef<Mesh>(null);
  const shaderRef = useRef<ShaderMaterial>(null);

  const noiseFilters = useAtomValue(noiseFiltersAtom);
  const elevationGradient = useAtomValue(elevationGradientAtom);
  const depthGradient = useAtomValue(depthGradientAtom);

  const [minimum, setMinimum] = useAtom(minimumAtom);
  const [maximum, setMaximum] = useAtom(maximumAtom);

  const meshGenerator = useRef(
    new MeshGenerator({
      resolution,
      localUp,
      noiseFilters,
    }),
  );

  useFrame(({ clock }) => {
    if (!shaderRef.current) return;

    shaderRef.current.uniforms.uTime = new Uniform(clock.getElapsedTime());
  });

  useLayoutEffect(() => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.uRadius = new Uniform(radius);

    shaderRef.current.uniforms.uIsBlend = new Uniform(isBlend);

    shaderRef.current.uniforms.uMinMax = new Uniform(
      new Vector2(minimum, maximum),
    );

    shaderRef.current.uniforms.uElevationGradientSize = new Uniform(
      elevationGradient.length,
    );

    shaderRef.current.uniforms.uDepthGradientSize = new Uniform(
      depthGradient.length,
    );

    shaderRef.current.uniforms.uElevationGradient = new Uniform([
      ...elevationGradient,
      ...new Array(MAX_GRADIENT_SIZE - elevationGradient.length)
        .fill(null)
        .map(() => ({
          anchor: 0,
          color: new Vector4(0),
        })),
    ]);

    shaderRef.current.uniforms.uDepthGradient = new Uniform([
      ...depthGradient,
      ...new Array(MAX_GRADIENT_SIZE - depthGradient.length)
        .fill(null)
        .map(() => ({
          anchor: 0,
          color: new Vector4(0),
        })),
    ]);
  }, [
    radius,
    elevationGradient,
    depthGradient,
    minimum,
    maximum,
    noiseFilters,
    isBlend,
  ]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    meshGenerator.current.resolution = resolution;
    meshGenerator.current.localUp = localUp;
    meshGenerator.current.noiseFilters = noiseFilters;

    const geometry = new BufferGeometry();

    const { vertices, indices, elevationMinMax, uv } =
      meshGenerator.current.generateTerrain();

    setMinimum((value) => Math.min(value, elevationMinMax.min));
    setMaximum((value) => Math.max(value, elevationMinMax.max));

    meshRef.current.clear();

    geometry.setAttribute("uv", new BufferAttribute(uv, 2));
    geometry.setAttribute("position", new BufferAttribute(vertices, 3));
    geometry.setIndex(new BufferAttribute(indices, 1));

    geometry.attributes.uv.needsUpdate = true;
    geometry.attributes.position.needsUpdate = true;

    geometry.computeVertexNormals();

    if (meshRef.current) {
      const oldGeometry = meshRef.current.geometry;
      meshRef.current.geometry = geometry;
      if (oldGeometry) oldGeometry.dispose();
    }

    return () => {
      geometry.dispose();
      meshRef.current?.geometry.dispose();
      setMinimum(Number.MAX_VALUE);
      setMaximum(Number.MIN_VALUE);
    };
  }, [resolution, localUp, noiseFilters]);

  return (
    <>
      <mesh ref={meshRef}>
        <bufferGeometry />
        <CustomShaderMaterial
          ref={shaderRef}
          vertexShader={planetVertex}
          fragmentShader={planetFragment}
          baseMaterial={MeshPhysicalMaterial}
          {...{ wireframe }}
          side={renderBackface ? DoubleSide : FrontSide}
        />
      </mesh>
    </>
  );
};

export default TerrainFace;
