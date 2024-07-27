import { BufferGeometry } from "three";

export function exportGeometryToOBJ(geometry: BufferGeometry): void {
  const worker = new Worker(
    new URL("../web-workers/mesh-export.worker.ts", import.meta.url),
    {
      type: "module",
    },
  );

  worker.onmessage = (event: MessageEvent<string>) => {
    const objData = event.data;

    const blob = new Blob([objData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mesh.obj";
    a.click();
    URL.revokeObjectURL(url);

    worker.terminate();
  };

  const geometryData = {
    attributes: geometry.attributes,
    indices: geometry.index,
  };

  worker.postMessage({ geometryData });
}
