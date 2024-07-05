import { MouseEventHandler, useRef, useState } from "react";
import { start } from "repl";
import { Vector2 } from "three";

type NumericValueProps = {
  title: string;
  icon?: any;
  value: number;
  onValueChange?: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  defaultValue: number;
  type?: "float" | "int";
};

type DragState = {
  dragging: boolean;
  start: number | null;
  initialInput: number;
};

const NumericValue = ({
  title,
  icon: Icon,
  value,
  step = 1,
  min,
  max,
  defaultValue = 0.1,
  onValueChange,
  type = "float",
}: NumericValueProps) => {
  const input = useRef<HTMLInputElement>(null);
  const label = useRef<HTMLDivElement>(null);

  const [dragState, setDragState] = useState<DragState>({
    dragging: false,
    start: null,
    initialInput: value,
  });

  const onMouseDown: MouseEventHandler<HTMLDivElement> = (e) => {
    if (dragState.dragging) return;

    setDragState({
      dragging: true,
      start: e.clientX,
      initialInput:
        type === "float"
          ? parseFloat(input.current?.value as string)
          : parseInt(input.current?.value as string),
    });
  };
  const onMouseUp: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!dragState.dragging) return;

    const endPosition = new Vector2(e.clientX, e.clientY);

    setDragState((state) => ({
      ...state,
      dragging: false,
    }));
  };

  const onMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!dragState.dragging) return;

    const difference = e.clientX - (dragState.start as number);
    const labelWidth = label.current?.getBoundingClientRect().width as number;

    const incrementCount = Math.round(difference / labelWidth / 0.05);

    if (!input.current) return;

    if (type === "float") {
      input.current.value = (
        dragState.initialInput +
        step * incrementCount
      ).toFixed(2);
    } else {
      input.current.value = Math.round(
        dragState.initialInput + step * incrementCount,
      ).toString();
    }

    // @ts-ignore
    onValueChange?.(input.current?.value);
  };

  return (
    <div className="flex items-center justify-between">
      <div
        ref={label}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex h-6 flex-grow cursor-col-resize items-center gap-2 opacity-60"
      >
        {!!Icon && <Icon />}
        <p className="text-xs font-medium">{title}</p>
      </div>
      <input
        defaultValue={value}
        step={step}
        {...(min !== undefined && { min })}
        {...(max !== undefined && { max })}
        onChange={(e) => {
          const value =
            type === "float"
              ? parseFloat(e.target.value || defaultValue.toString())
              : parseInt(e.target.value || defaultValue.toString());

          onValueChange?.(value);

          e.target.value = value.toString();
        }}
        onKeyDown={(e) => {
          // @ts-ignore
          if (e.key === "Backspace") e.target.value = "";
        }}
        ref={input}
        type="number"
        className="h-6 min-w-4 flex-shrink-0 rounded bg-slate-200 text-center text-xs font-medium text-slate-600"
      />
    </div>
  );
};

export default NumericValue;
