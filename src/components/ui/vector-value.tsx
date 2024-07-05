import { VECTOR_ZERO } from "@/util/vector";
import { Vector3 } from "three";

type VectorValueProps = {
  title: string;
  icon?: any;
  value: Vector3;
  defaultValue?: Vector3;
  onValueChange?: (value: Vector3) => void;
  step?: number;
};

const VectorValue = ({
  title,
  icon: Icon,
  step = 1,
  onValueChange,
  value,
  defaultValue = VECTOR_ZERO,
}: VectorValueProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-6 w-full items-center gap-2 opacity-60">
        {!!Icon && <Icon />}
        <p className="text-xs font-medium">{title}</p>
      </div>
      <div className="ml-5 flex gap-2">
        <div className="flex h-6 flex-shrink-0 flex-grow items-center gap-1 rounded bg-slate-200 px-2 text-center text-xs font-medium text-slate-600">
          <label htmlFor="x">X:</label>
          <input
            id="x"
            defaultValue={defaultValue.x}
            value={value.x}
            step={step}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const currentValue = parseFloat(
                e.target.value || defaultValue.toString(),
              );

              onValueChange?.(new Vector3(currentValue, value.y, value.z));

              e.target.value = currentValue.toString();
            }}
            type="number"
            className="w-1 flex-grow bg-transparent text-end outline-none"
          />
        </div>
        <div className="flex h-6 flex-shrink-0 flex-grow items-center gap-1 rounded bg-slate-200 px-2 text-center text-xs font-medium text-slate-600">
          <label htmlFor="y">Y:</label>
          <input
            id="y"
            defaultValue={defaultValue.y}
            value={value.y}
            step={step}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const currentValue = parseFloat(
                e.target.value || defaultValue.toString(),
              );

              onValueChange?.(new Vector3(value.x, currentValue, value.z));

              e.target.value = currentValue.toString();
            }}
            type="number"
            className="w-1 flex-grow bg-transparent text-end outline-none"
          />
        </div>
        <div className="flex h-6 flex-shrink-0 flex-grow items-center gap-1 rounded bg-slate-200 px-2 text-center text-xs font-medium text-slate-600">
          <label htmlFor="z">Z:</label>
          <input
            id="z"
            defaultValue={defaultValue.z}
            value={value.z}
            step={step}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              const currentValue = parseFloat(
                e.target.value || defaultValue.toString(),
              );

              onValueChange?.(new Vector3(value.x, value.y, currentValue));

              e.target.value = currentValue.toString();
            }}
            type="number"
            className="w-1 flex-grow bg-transparent text-end outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default VectorValue;
