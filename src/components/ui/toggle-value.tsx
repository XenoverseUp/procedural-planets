import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

type ToggleInputProps = {
  title: string;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  icon?: any;
  labels: {
    on: string;
    off: string;
  };
};

const ToggleValue = ({
  title,
  onValueChange,
  icon: Icon,
  labels: { on, off },
  value,
}: ToggleInputProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex h-6 flex-grow cursor-col-resize items-center gap-2 opacity-60">
        {!!Icon && <Icon />}
        <p className="text-xs font-medium">{title}</p>
      </div>
      <div className="w-20">
        <Checkbox.Root
          defaultChecked={value}
          onCheckedChange={(checked) => onValueChange?.(checked as boolean)}
          className="flex size-5 items-center justify-center rounded bg-slate-200 text-slate-600"
        >
          <Checkbox.Indicator asChild>
            <CheckIcon />
          </Checkbox.Indicator>
        </Checkbox.Root>
      </div>
    </div>
  );
};

export default ToggleValue;
