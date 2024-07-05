import * as Slider from "@radix-ui/react-slider";
import { useEffect, useState } from "react";

type SliderInputProps = {
  label: string;
  description?: string;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  labels?: string[];
  step?: number;
  min: number;
  max: number;
};

const SliderInput = ({
  label,
  description,
  defaultValue = 5,
  onValueChange,
  labels,
  step = 1,
  min,
  max,
}: SliderInputProps) => {
  const [inputValue, setInputValue] = useState<number>(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-end justify-between">
        <h3 className="font-medium">{label}</h3>

        <div className="flex w-1/2 flex-col items-center gap-2">
          {labels && (
            <div className="flex w-full justify-between">
              {labels.map((label, i) => (
                <span key={`${label}-slider-i`} className="text-xs opacity-60">
                  {label}
                </span>
              ))}
            </div>
          )}
          <Slider.Root
            value={[inputValue]}
            onValueChange={([value]) => {
              setInputValue(value);
              onValueChange?.(value);
            }}
            {...{
              step,
              min,
              max,
            }}
            className="relative flex h-4 w-full items-center"
          >
            <Slider.Track className="relative h-full flex-grow overflow-hidden rounded-full border bg-neutral-50">
              <Slider.Range className="absolute h-full bg-slate-400" />
            </Slider.Track>
            <Slider.Thumb
              className="block h-4 w-4 outline-none"
              aria-label="Volume"
            />
          </Slider.Root>
        </div>
      </div>
      {!!description && (
        <span className="mt-3 text-xs leading-relaxed opacity-50">
          {description}
        </span>
      )}
    </div>
  );
};

export default SliderInput;
