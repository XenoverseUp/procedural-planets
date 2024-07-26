import { Mesh } from "three";
import { OBJExporter } from "three/examples/jsm/exporters/OBJExporter";

export const exportMeshToOBJ = (mesh: Mesh) => {
  const exporter = new OBJExporter();
  const objData = exporter.parse(mesh);
  console.log(objData);

  // Create a Blob from the OBJ data
  const blob = new Blob([objData], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  // Create a temporary link element to trigger the download
  // const link = document.createElement("a");
  // link.href = url;
  // link.download = "mesh.obj";
  // document.body.appendChild(link);
  // link.click();
  // document.body.removeChild(link);
};
