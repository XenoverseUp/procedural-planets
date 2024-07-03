import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import NumberInput from "./ui/number-input";
import { useAtom } from "jotai";
import { layerCountAtom } from "../atoms/settings";
import NoiseLayerDetail from "./composed/noise-layer-detail";

const Sidebar = () => {
  const [layerCount, setLayerCount] = useAtom(layerCountAtom);

  return (
    <aside className="h-full w-96 flex-shrink-0 overflow-hidden rounded-lg bg-white">
      <header className="border-b px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-medium">
          <MixerHorizontalIcon />
          <span>Control Panel</span>
        </h2>
      </header>
      <div className="p-4">
        <section>
          <NumberInput
            label="Noise Layers"
            description="Defines the level of detail (LOD) for the generated terrain. Max number of layers is 4."
            defaultValue={layerCount}
            onValueChange={(value) => setLayerCount(value)}
          />

          <div className="mt-4 w-full space-y-2">
            {new Array(layerCount).fill(null).map((_, i) => (
              <NoiseLayerDetail title={`Noise Layer ${i + 1}`} />
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default Sidebar;
