import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import NumberInput from "./ui/number-input";
import { useAtom } from "jotai";
import {
  layerCountAtom,
  meshResolutionAtom,
  planetRadiusAtom,
} from "../atoms/settings";
import NoiseLayerDetail from "./composed/noise-layer-detail";
import SliderInput from "./ui/slider-input";

const Sidebar = () => {
  const [layerCount, setLayerCount] = useAtom(layerCountAtom);
  const [meshResolution, setMeshResolution] = useAtom(meshResolutionAtom);
  const [planetRadius, setPlanetRadius] = useAtom(planetRadiusAtom);

  return (
    <aside className="h-full w-96 flex-shrink-0 overflow-hidden rounded-lg bg-white">
      <header className="border-b px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-medium">
          <MixerHorizontalIcon />
          <span>Control Panel</span>
        </h2>
      </header>
      <div className="space-y-8 p-4">
        <SliderInput
          label="Planet Radius"
          defaultValue={planetRadius}
          onValueChange={setPlanetRadius}
          labels={["1", "3"]}
          min={1}
          max={3}
          step={0.1}
        />
        <SliderInput
          label="Resolution"
          description="Defines the level resolution of the planet mesh. The higher this value, the more room for detail. The lower this value, the higher performance."
          defaultValue={meshResolution}
          onValueChange={setMeshResolution}
          labels={["5", "50", "100"]}
          min={5}
          max={100}
          step={5}
        />
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
