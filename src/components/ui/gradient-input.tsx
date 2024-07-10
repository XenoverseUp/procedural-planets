import { elevationGradientAtom } from "@/atoms/settings";
import { useAtom } from "jotai";
import { useLayoutEffect, useRef } from "react";

type GradientInputProps = {
  label: string;
  description?: string;
};

const GradientInput = ({ label, description }: GradientInputProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elevationGradient, setElevationGradient] = useAtom(
    elevationGradientAtom,
  );

  useLayoutEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const canvasRect = canvas.getBoundingClientRect();

    canvas.width = canvasRect.width * dpr;
    canvas.height = canvasRect.height * dpr;

    ctx.scale(dpr, dpr);

    const gradient = ctx.createLinearGradient(0, 0, canvasRect.width, 0);

    for (let colorStop of elevationGradient) {
      const scaledColor = colorStop.color.clone().multiplyScalar(255);
      gradient.addColorStop(
        Math.max(0, colorStop.anchor),
        `rgb(${scaledColor.x}, ${scaledColor.y}, ${scaledColor.z})`,
      );
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasRect.width, canvasRect.height);
  }, []);

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-end justify-between">
        <h3 className="font-medium">{label}</h3>
      </div>
      {!!description && (
        <span className="mt-3 text-xs leading-relaxed opacity-50">
          {description}
        </span>
      )}

      <div className="mt-4">
        <canvas ref={canvasRef} className="h-12 w-full rounded-lg border" />
      </div>
    </div>
  );
};

export default GradientInput;
