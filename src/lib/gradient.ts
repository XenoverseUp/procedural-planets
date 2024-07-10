import { Vector4 } from "three";

interface ElevationGradientStop {
  anchor: number;
  color: Vector4;
  toRGB: () => string;
}

type ElevationGradientStopParams = Omit<ElevationGradientStop, "toRGB">;

class GradientStop implements ElevationGradientStop {
  anchor: number;
  color: Vector4;

  constructor({ anchor, color }: ElevationGradientStopParams) {
    this.anchor = anchor;
    this.color = color;
  }

  toRGB = (): string => {
    return `rgba(${this.color.x * 255}, ${this.color.y * 255}, ${this.color.z * 255}, ${this.color.w * 255})`;
  };
}

export default GradientStop;
