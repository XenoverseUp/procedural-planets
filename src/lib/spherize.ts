import { Vector3 } from "three";

const spherize = (pointOnCube: Vector3) => {
  const { x, y, z } = pointOnCube;
  const xSqr = x ** 2;
  const ySqr = y ** 2;
  const zSqr = z ** 2;

  return new Vector3(
    x * Math.sqrt(1 - ySqr / 2 - zSqr / 2 + (ySqr * zSqr) / 3),
    y * Math.sqrt(1 - zSqr / 2 - xSqr / 2 + (xSqr * zSqr) / 3),
    z * Math.sqrt(1 - xSqr / 2 - ySqr / 2 + (ySqr * xSqr) / 3),
  );
};

export default spherize;
