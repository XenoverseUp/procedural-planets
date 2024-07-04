import * as Toggle from "@radix-ui/react-toggle";
import { GlobeIcon } from "@radix-ui/react-icons";
import { ClassValue } from "clsx";
import cn from "../../util/cn";
import { useAtom } from "jotai";
import { isWireframeAtom } from "../../atoms/settings";

const Toolbar = ({ className }: { className?: ClassValue }) => {
  const [isWireframe, setIsWireframe] = useAtom(isWireframeAtom);

  return (
    <div className={cn(className, "flex gap-2")}>
      <Toggle.Root
        pressed={isWireframe}
        onPressedChange={(pressed) => setIsWireframe(pressed)}
        className="group flex size-8 cursor-pointer items-center justify-center rounded border bg-white"
      >
        <GlobeIcon className="group-radix-state-on:opacity-100 opacity-40" />
      </Toggle.Root>
    </div>
  );
};

export default Toolbar;
