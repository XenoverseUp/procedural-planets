export function generateTerrain(resolution: u32): usize {
  const vertices = new Array<f32>(6);
  const triangles = new Array<u16>(6);

  for (let i = 0; i < resolution; i++) {
    vertices[i] = (i as f32) / 2.0;
    triangles[i] = i as u16;
  }

  // Create an object to hold the arrays
  const result = new Array<usize>(2);
  result[0] = vertices.dataStart;
  result[1] = triangles.dataStart;

  return result.dataStart;
}
