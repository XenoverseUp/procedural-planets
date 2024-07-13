import {
  isBlendAtom,
  isWireframeAtom,
  rendersGlobeAtom,
} from "@/atoms/settings";
import cn from "@/lib/cn";
import { ColorWheelIcon, GlobeIcon, ShadowIcon } from "@radix-ui/react-icons";
import * as Toggle from "@radix-ui/react-toggle";
import { ClassValue } from "clsx";
import { useAtom } from "jotai";

const Toolbar = ({ className }: { className?: ClassValue }) => {
  const [isWireframe, setIsWireframe] = useAtom(isWireframeAtom);
  const [rendersGlobe, setRendersGlobe] = useAtom(rendersGlobeAtom);
  const [isBlend, setIsBlend] = useAtom(isBlendAtom);

  return (
    <div className={cn(className, "flex gap-2")}>
      <Toggle.Root
        pressed={isWireframe}
        onPressedChange={(pressed) => setIsWireframe(pressed)}
        className="group flex size-8 cursor-pointer items-center justify-center rounded bg-white transition-colors radix-state-on:bg-blue-100"
      >
        <GlobeIcon className="text-neutral-500 transition-[colors,opacity] group-radix-state-on:text-blue-500" />
      </Toggle.Root>
      <Toggle.Root
        pressed={isBlend}
        onPressedChange={(pressed) => setIsBlend(pressed)}
        className="group flex size-8 cursor-pointer items-center justify-center rounded bg-white"
      >
        {isBlend ? (
          <ShadowIcon className="text-neutral-500" />
        ) : (
          <ColorWheelIcon className="text-neutral-500" />
        )}
      </Toggle.Root>

      <Toggle.Root
        pressed={rendersGlobe}
        onPressedChange={(pressed) => setRendersGlobe(pressed)}
        className="group flex h-8 cursor-pointer items-center justify-center rounded bg-white px-2"
      >
        <p className="mx-1 text-xs text-neutral-500">
          {rendersGlobe ? "Globe" : "Front Face"}
        </p>
      </Toggle.Root>
    </div>
  );
};

export default Toolbar;
