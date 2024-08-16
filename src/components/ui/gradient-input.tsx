// @ts-nocheck

import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import clamp from "@/lib/clamp";
import cn from "@/lib/cn";
import GradientStop from "@/lib/gradient";
import { Vector4 } from "three";
import lerp from "@/lib/lerp";
import map from "@/lib/map";
import { RgbColorPicker } from "react-colorful";

type GradientInputProps = {
  label: string;
  description?: string;
  datasetKey: string;
  gradientState: ReturnType<typeof useState<GradientStop[]>> | any;
};

const GradientInput = ({
  label,
  description,
  datasetKey,
  gradientState,
}: GradientInputProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const [selected, setSelected] = useState<number | null>(null);
  const [gradient, setGradient] = gradientState;

  const onThumbMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    const index = parseInt(e.target.dataset.index, 10);

    setSelected(index);
    document.body.dataset[datasetKey] = e.target.dataset.index;

    document.addEventListener("mousemove", onThumbMouseMove);
    document.addEventListener("mouseup", onThumbMouseUp);
  };

  const onThumbMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
    (e) => {
      const { width, left } = trackRef.current!.getBoundingClientRect();
      const index = parseInt(document.body.dataset[datasetKey], 10);

      if (Number.isNaN(index)) return;

      const progress = clamp(0, 1, (e.clientX - left) / width);

      setGradient((gradient) => {
        const leftBound = index === 0 ? 0 : gradient[index - 1].anchor;
        const rightBound =
          index === gradient.length - 1 ? 1 : gradient[index + 1].anchor;

        const updated = [...gradient];
        updated.at(index)!.anchor = progress;

        if (progress > rightBound) {
          document.body.dataset[datasetKey] = index + 1;
          setSelected(index + 1);
        }

        if (progress < leftBound) {
          document.body.dataset[datasetKey] = index - 1;
          setSelected(index - 1);
        }

        updated.sort((a, b) => a.anchor - b.anchor);

        return updated;
      });
    },
    [trackRef, setGradient],
  );

  const onThumbMouseUp = () => {
    document.removeEventListener("mousemove", onThumbMouseMove);
    document.removeEventListener("mouseup", onThumbMouseUp);
  };

  const onThumbDoubleClick = () => {
    if (gradient.length <= 2) return;

    setGradient((gradient) => gradient.toSpliced(selected, 1));
    setSelected(null);
    onThumbMouseUp();
    document.body.dataset[datasetKey] = undefined;
  };

  const onSliderClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (gradient.length >= 10) return;

    const slider = e.target as HTMLDivElement;
    const rect = slider.getBoundingClientRect();

    const margin = 0.05 * rect.width;
    const width = rect.width - 2 * margin;
    const sliderLeft = rect.left + margin;

    const progress = clamp(
      0,
      1,
      map(sliderLeft, sliderLeft + width, e.clientX),
    );

    const isValid = (gradient as GradientStop[]).every(
      (stop) => Math.abs(stop.anchor - progress) > 0.04,
    );

    if (!isValid) return;

    const afterStopIndex = (gradient as GradientStop[]).findIndex(
      (stop) => stop.anchor > progress,
    );
    const beforeStopIndex = afterStopIndex - 1;

    const afterStop: GradientStop = gradient.at(afterStopIndex);
    const beforeStop: GradientStop = gradient.at(beforeStopIndex);
    const amount = map(beforeStop.anchor, afterStop.anchor, progress);

    const color = new Vector4(
      lerp(beforeStop.color.x, afterStop.color.x, amount),
      lerp(beforeStop.color.y, afterStop.color.y, amount),
      lerp(beforeStop.color.z, afterStop.color.z, amount),
      1,
    );

    const stop: GradientStop = new GradientStop({
      anchor: progress,
      color,
    });

    const updated = [...gradient, stop];
    updated.sort((a, b) => a.anchor - b.anchor);

    setGradient(updated);
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
        <div className="mb-2 flex w-full justify-between px-3">
          <span className="text-xs opacity-60">0,0</span>
          <span className="text-xs opacity-60">0,5</span>
          <span className="text-xs opacity-60">1,0</span>
        </div>
        <div
          onClick={onSliderClick}
          className="h-12 w-full rounded-full border-y border-black/10"
          style={{
            background: `linear-gradient(to right, ${gradient.map((stop) => `rgb(${stop.color.x * 255}, ${stop.color.y * 255}, ${stop.color.z * 255}) ${(stop.anchor * 0.9 + 0.05) * 100}%`).join(",")})`,
          }}
        />
        <div className="relative mx-auto w-[90%] -translate-y-2" ref={trackRef}>
          {gradient.map((stop, i) => (
            <div
              key={`thumb-${i}`}
              tabIndex={0}
              data-index={i}
              className={cn(
                "absolute grid size-4 -translate-x-1/2 place-items-center rounded-full border border-black ring-2 ring-white",
                { "z-10": i === selected },
              )}
              style={{
                left: `${stop.anchor * 100}%`,
                backgroundColor: stop.toRGB(),
              }}
              onDoubleClick={onThumbDoubleClick}
              onMouseDown={onThumbMouseDown}
            >
              {selected == i && (
                <span className="pointer-events-none size-1 rounded-full border border-black bg-white" />
              )}
            </div>
          ))}
        </div>
      </div>

      {selected !== null && (
        <div className="mt-6">
          <RgbColorPicker
            className="!w-full !rounded-none"
            color={{
              r: gradient.at(selected).color.x * 255,
              g: gradient.at(selected).color.y * 255,
              b: gradient.at(selected).color.z * 255,
            }}
            onChange={(c) =>
              setGradient((g) => {
                const updated = [...g];
                updated.at(selected).color = new Vector4(
                  c.r / 255,
                  c.g / 255,
                  c.b / 255,
                  1,
                );
                return updated;
              })
            }
          />
        </div>
      )}
    </div>
  );
};

export default GradientInput;
