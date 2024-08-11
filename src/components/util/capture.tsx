import { useThree } from "@react-three/fiber";
import { forwardRef, useImperativeHandle } from "react";
import * as THREE from "three";

export interface CaptureRef {
  capture: (position?: THREE.Vector3) => Promise<string>;
}

const Capture = forwardRef<CaptureRef, {}>((_, ref) => {
  const { gl, scene, camera } = useThree();

  useImperativeHandle(ref, () => ({
    capture: async (position?: THREE.Vector3) => {
      return new Promise<string>((resolve) => {
        // Temporarily set the camera to the specified position
        const originalPosition = camera.position.clone();
        const originalRotation = camera.rotation.clone();
        if (position) {
          camera.position.copy(position);
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();
        }

        // Render the scene to the canvas
        gl.render(scene, camera);

        // Restore the original camera position and rotation
        camera.position.copy(originalPosition);
        camera.rotation.copy(originalRotation);
        camera.updateProjectionMatrix();

        // Extract the image from the canvas
        const canvas = gl.domElement;
        const image = canvas.toDataURL("image/png");

        // Resolve the promise with the image data URL
        resolve(image);
      });
    },
  }));

  return null;
});

export default Capture;
