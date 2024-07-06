import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import StepInput from "@/components/ui/step-input";
import { useAtom } from "jotai";
import {
  meshResolutionAtom,
  noiseFiltersAtom,
  planetRadiusAtom,
} from "@/atoms/settings";
import NoiseSettingsDetail from "@/components/composed/noise-settings-detail";
import SliderInput from "@/components/ui/slider-input";
import { SimpleNoiseFilter } from "@/lib/noise";
import { VECTOR_ZERO } from "@/lib/vector";

const Sidebar = () => {
  const [meshResolution, setMeshResolution] = useAtom(meshResolutionAtom);
  const [planetRadius, setPlanetRadius] = useAtom(planetRadiusAtom);
  const [noiseFilters, setNoiseFilters] = useAtom(noiseFiltersAtom);

  return (
    <aside className="flex h-full w-96 flex-shrink-0 flex-col overflow-hidden rounded-lg bg-white">
      <header className="border-b px-4 py-3">
        <h2 className="flex items-center gap-2 text-sm font-medium">
          <MixerHorizontalIcon />
          <span>Planet Generator</span>
        </h2>
      </header>
      <div className="space-y-8 overflow-y-auto overflow-x-hidden p-4">
        <SliderInput
          label="Planet Radius"
          defaultValue={planetRadius}
          onValueChange={setPlanetRadius}
          labels={["1", "2"]}
          min={1}
          max={2}
          step={0.05}
        />
        <SliderInput
          label="Resolution"
          description="Defines the level resolution of the planet mesh. The higher this value, the more room for detail. The lower this value, the higher performance."
          defaultValue={meshResolution}
          onValueChange={setMeshResolution}
          labels={["8", "256"]}
          min={8}
          max={256}
          step={2}
        />
        <section>
          <StepInput
            label="Noise Settings"
            description="Defines the level of detail (LOD) for the generated terrain. Max number of layers is 4."
            defaultValue={noiseFilters.length}
            onIncrement={() => {
              setNoiseFilters((filters) => [
                ...filters,
                new SimpleNoiseFilter({
                  strength: 0.2,
                  roughness: 2.25,
                  baseRoughness: 0.7,
                  center: VECTOR_ZERO,
                  persistence: 0.5,
                  minValue: 1.1,
                  layerCount: 5,
                  enabled: true,
                }),
              ]);
            }}
            onDecrement={() => {
              setNoiseFilters((filters) => [
                ...filters.slice(0, filters.length - 1),
              ]);
            }}
          />

          <div className="mt-4 w-full space-y-2">
            {noiseFilters.map((_, i) => (
              <NoiseSettingsDetail
                key={`noise-filter-${i}`}
                index={i}
                title={`Noise Setting ${i + 1}`}
              />
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default Sidebar;