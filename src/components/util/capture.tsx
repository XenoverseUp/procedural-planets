import { useThree } from "@react-three/fiber";
import { forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";
import { Vector3 } from "three";

export interface CaptureRef {
  capture: (
    position?: THREE.Vector3,
    lookAt?: THREE.Vector3,
  ) => Promise<string>;
}

const Capture = forwardRef<CaptureRef, {}>((_, ref) => {
  const { gl, scene, camera } = useThree();

  useImperativeHandle(ref, () => ({
    capture: (position?: THREE.Vector3, lookAt?: THREE.Vector3) => {
      return new Promise<string>((resolve) => {
        const originalPosition = camera.position.clone();
        const originalRotation = camera.rotation.clone();
        if (position) {
          camera.position.copy(position);
          camera.lookAt(lookAt ?? new Vector3(0, 0, 0));
          camera.updateProjectionMatrix();
        }

        gl.render(scene, camera);

        camera.position.copy(originalPosition);
        camera.rotation.copy(originalRotation);
        camera.updateProjectionMatrix();

        const canvas = gl.domElement;
        const image = canvas.toDataURL("image/png");

        resolve(image);
      });
    },
  }));

  return null;
});

export default Capture;
