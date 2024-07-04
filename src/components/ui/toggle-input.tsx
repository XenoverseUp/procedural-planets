import * as Slider from "@radix-ui/react-slider";
import { useEffect, useState } from "react";

type ToggleInputProps = {
  label: string;
  description?: string;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
};

const ToggleInput = ({
  label,
  description,
  defaultValue = 5,
  onValueChange,
}: ToggleInputProps) => {
  const [inputValue, setInputValue] = useState<number>(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{label}</h3>

        <div className="flex w-2/3 flex-col items-center gap-2">
          <div className="flex w-full justify-between">
            <span className="text-xs opacity-60">5</span>
            <span className="text-xs opacity-60">50</span>
            <span className="text-xs opacity-60">100</span>
          </div>
          <Slider.Root
            value={[inputValue]}
            onValueChange={([value]) => {
              setInputValue(value);
              onValueChange?.(value);
            }}
            min={5}
            max={100}
            step={5}
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

export default ToggleInput;
