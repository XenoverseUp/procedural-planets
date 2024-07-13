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

  useEffect(() => {
    console.log({ gradient });
  });

  const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    const index = parseInt(e.target.dataset.index, 10);

    setSelected(index);
    document.body.dataset[datasetKey] = e.target.dataset.index;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
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

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const onDoubleClick = () => {
    if (gradient.length <= 2) return;

    setGradient((gradient) => gradient.toSpliced(selected, 1));
    setSelected(null);
    onMouseUp();
    document.body.dataset[datasetKey] = undefined;
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
              onDoubleClick={onDoubleClick}
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
