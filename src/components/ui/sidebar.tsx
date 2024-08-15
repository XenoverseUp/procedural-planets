import {
  depthGradientAtom,
  elevationGradientAtom,
  meshResolutionAtom,
  noiseFiltersAtom,
} from "@/atoms/settings";
import NoiseSettingsDetail from "@/components/ui/noise-settings-detail";
import GradientInput from "@/components/ui/gradient-input";
import SliderInput from "@/components/ui/slider-input";
import StepInput from "@/components/ui/step-input";
import { SimpleNoiseFilter } from "@/lib/noise";
import { VECTOR_ZERO } from "@/lib/vector";
import {
  BookmarkFilledIcon,
  GitHubLogoIcon,
  MixerHorizontalIcon,
  ReaderIcon,
} from "@radix-ui/react-icons";
import { useAtom } from "jotai";
import { motion } from "framer-motion";
import { Vector3 } from "three";

const Sidebar = () => {
  const [meshResolution, setMeshResolution] = useAtom(meshResolutionAtom);
  const [noiseFilters, setNoiseFilters] = useAtom(noiseFiltersAtom);
  const elevationGradientState = useAtom(elevationGradientAtom);
  const depthGradientState = useAtom(depthGradientAtom);

  return (
    <motion.div
      exit={{
        width: 0,
        opacity: 0,
        transition: {
          type: "spring",
        },
      }}
      className="flex-shrink-0 overflow-hidden"
    >
      <aside className="mr-2 flex h-full w-96 flex-col overflow-hidden rounded-lg bg-white">
        <header className="flex items-center justify-between border-b px-4 py-3">
          <h2 className="flex items-center gap-2 text-sm font-medium">
            <MixerHorizontalIcon />
            <span>Control Panel </span>
          </h2>

          <a
            className="flex items-center justify-center gap-2 rounded-full border bg-transparent px-3 py-2 text-xs transition-colors hover:bg-neutral-100 active:bg-neutral-200 active:transition-none"
            href="https://github.com/XenoverseUp/procedural-planets"
            target="_blank"
          >
            <GitHubLogoIcon />
            Star on Github
          </a>
        </header>
        <div className="space-y-8 overflow-y-auto overflow-x-hidden p-4 pb-8">
          <SliderInput
            label="Resolution"
            description="Defines the level resolution of the planet mesh. The higher this value, the more room for detail. The lower this value, the higher performance."
            defaultValue={meshResolution}
            onValueChange={setMeshResolution}
            labels={["8", "512"]}
            min={8}
            max={512}
            step={2}
          />
          <section>
            <StepInput
              label="Noise Settings"
              description="Defines the level of detail (LOD) for the generated terrain. Max number of layers is 3."
              defaultValue={noiseFilters.length}
              onIncrement={() => {
                setNoiseFilters((filters) => [
                  ...filters,
                  new SimpleNoiseFilter({
                    enabled: true,
                    strength: 0.2,
                    roughness: 2.5,
                    baseRoughness: 1.2,
                    center: new Vector3(
                      Math.round(Math.random() * 1000),
                      Math.round(Math.random() * 1000),
                      Math.round(Math.random() * 1000),
                    ),
                    persistence: 0.5,
                    minValue: 1.1,
                    layerCount: 10,
                    useFirstLayerAsMask: false,
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

          <GradientInput
            label="Elevation"
            description="Assigns different colors to different elevations on the planet. 0,0 means the lowest vertex and 1,0 means the highest vertex."
            datasetKey="elevationThumb"
            gradientState={elevationGradientState}
          />

          <GradientInput
            label="Depth"
            description="Assigns different colors to different depths in the sea. 0,0 means the lowest vertex and 1,0 means the highest vertex in the sea."
            datasetKey="depthThumb"
            gradientState={depthGradientState}
          />
        </div>
      </aside>
    </motion.div>
  );
};

export default Sidebar;
