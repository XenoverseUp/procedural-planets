import * as Collapsible from "@radix-ui/react-collapsible";
import { MarginIcon, ResetIcon } from "@radix-ui/react-icons";
import { useAtom } from "jotai";
import { firstLayerAtom } from "../../atoms/settings";

type NoiseLayerDetailProps = {
  title: string;
};

const NoiseLayerDetail = ({ title }: NoiseLayerDetailProps) => {
  const [layer, setLayer] = useAtom(firstLayerAtom);

  return (
    <Collapsible.Root className="w-full rounded-xl bg-slate-100">
      <Collapsible.Trigger asChild>
        <div className="flex cursor-pointer select-none items-center justify-between px-4 py-3">
          <h4 className="flex items-center gap-2 text-sm">
            <MarginIcon />
            <span>{title}</span>
          </h4>

          <div className="flex items-center gap-2">
            <button
              className="rounded p-1 transition-colors hover:bg-black/5"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <ResetIcon />
            </button>
          </div>
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content className="px-4">
        <p>Amplitude: {layer.amplitude}</p>
        <input
          type="number"
          onChange={(e) => setLayer({ amplitude: parseFloat(e.target.value) })}
        />
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default NoiseLayerDetail;
