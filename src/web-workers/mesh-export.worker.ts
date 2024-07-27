// @ts-nocheck

import {
  BufferGeometry,
  Float32BufferAttribute,
  Mesh,
  MeshBasicMaterial,
  Uint32BufferAttribute,
} from "three";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter";

self.onmessage = (event: MessageEvent) => {
  const { geometryData } = event.data;

  const geometry = new BufferGeometry();

  if (geometryData.attributes) {
    for (const [key, attribute] of Object.entries(geometryData.attributes)) {
      const array = new Float32Array(attribute.array);
      const bufferAttribute = new Float32BufferAttribute(
        array,
        attribute.itemSize,
      );
      geometry.setAttribute(key, bufferAttribute);
    }
  }

  if (geometryData.indices) {
    const indexArray = new Uint32Array(geometryData.indices.array);
    const indexAttribute = new Uint32BufferAttribute(
      indexArray,
      geometryData.indices.itemSize,
    );
    geometry.setIndex(indexAttribute);
  }

  const tempMesh = new Mesh(geometry, new MeshBasicMaterial());
  const exporter = new OBJExporter();
  const objData = exporter.parse(tempMesh) as string;

  self.postMessage(objData);
};
