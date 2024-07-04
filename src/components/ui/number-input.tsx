import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";

type NumberInputProps = {
  label?: string;
  description?: string;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
};

const NumberInput = ({
  label,
  description,
  defaultValue = 1,
  onValueChange,
}: NumberInputProps) => {
  const [inputValue, setInputValue] = useState(defaultValue);

  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  const increment = useCallback(() => {
    if (inputValue < 4) {
      setInputValue((value) => value + 1);
      onValueChange?.(inputValue + 1);
    }
  }, [inputValue]);

  const decrement = useCallback(() => {
    if (inputValue > 1) {
      setInputValue((value) => value - 1);
      onValueChange?.(inputValue - 1);
    }
  }, [inputValue]);

  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{label}</h3>
        <div className="flex h-9 overflow-hidden rounded-full border">
          <button
            className="flex h-full w-8 items-center justify-center border-r bg-neutral-50 hover:bg-neutral-100 active:opacity-60 disabled:opacity-50"
            onClick={decrement}
            disabled={inputValue == 1}
          >
            <MinusIcon width={12} />
          </button>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => {
              const { value } = e.target;

              let number = parseInt(value);

              if (Number.isNaN(number)) number = 0;

              setInputValue(number);
              onValueChange?.(number);
            }}
            className="pointer-events-none h-full w-8 border-none text-center text-sm outline-none"
          />
          <button
            className="flex h-full w-8 items-center justify-center border-l bg-neutral-50 hover:bg-neutral-100 active:opacity-60 disabled:opacity-50"
            onClick={increment}
            disabled={inputValue == 4}
          >
            <PlusIcon width={12} />
          </button>
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

export default NumberInput;
