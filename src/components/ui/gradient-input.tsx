// @ts-nocheck

import { elevationGradientAtom } from "@/atoms/settings";
import { useAtom } from "jotai";
import { MouseEventHandler, useLayoutEffect, useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Vector2 } from "three";
import clamp from "@/lib/clamp";

type GradientInputProps = {
  label: string;
  description?: string;
};

const GradientInput = ({ label, description }: GradientInputProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const [elevationGradient, setElevationGradient] = useAtom(
    elevationGradientAtom,
  );

  const [selected, setSelected] = useState<number | null>(null);

  const [dragState, setDragState] = useState<{
    dragging: boolean;
    dragStart: number;
  }>({
    dragging: false,
    dragStart: 0,
  });

  const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    setSelected(parseInt(e.target.dataset.index as string));
    document.body.dataset.index = e.target.dataset.index;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    const { width, left } = trackRef.current!.getBoundingClientRect();
    const index = parseInt(document.body.dataset.index as string);

    if (Number.isNaN(index)) return;

    const progress = clamp(0, 1, (e.clientX - left) / width);

    setElevationGradient((gradient) => {
      const leftBound = index === 0 ? 0 : gradient[index - 1].anchor;
      const rightBound =
        index === gradient.length - 1 ? 1 : gradient[index + 1].anchor;

      const updated = [...gradient];
      updated.at(index)!.anchor = progress;

      if (progress > rightBound) {
        document.body.dataset.index = index + 1;
        setSelected(index + 1);
      }

      if (progress < leftBound) {
        document.body.dataset.index = index - 1;
        setSelected(index - 1);
      }

      updated.sort((a, b) => a.anchor - b.anchor);

      return updated;
    });
  };

  // @ts-ignore
  const onMouseUp: MouseEventHandler<HTMLDivElement> = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

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

      <div className="mt-3 w-full">
        <div
          className="h-12 w-full rounded-full border border-black"
          style={{
            background: `linear-gradient(to right, ${elevationGradient.map((stop) => `rgb(${stop.color.x * 255}, ${stop.color.y * 255}, ${stop.color.z * 255}) ${(stop.anchor * 0.9 + 0.05) * 100}%`).join(",")})`,
          }}
        />
        <div className="relative mx-auto w-[90%] -translate-y-2" ref={trackRef}>
          {elevationGradient.map((stop, i) => (
            <div
              key={`thumb-${i}`}
              tabIndex={0}
              data-index={i}
              className="absolute grid size-4 -translate-x-1/2 place-items-center rounded-full border border-black shadow"
              style={{
                left: `${stop.anchor * 100}%`,
                backgroundColor: stop.toRGB(),
              }}
              // onClick={() => setSelected(i)}
              onMouseDown={onMouseDown}
            >
              {selected == i && (
                <span className="size-1 rounded-full border border-black bg-white" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GradientInput;
