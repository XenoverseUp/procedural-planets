import * as Collapsible from "@radix-ui/react-collapsible";
import {
  BarChartIcon,
  CrumpledPaperIcon,
  LayersIcon,
  ResetIcon,
  ShadowIcon,
  TargetIcon,
  TextAlignBottomIcon,
} from "@radix-ui/react-icons";
import { useAtom } from "jotai";
import { noiseFiltersAtom } from "@/atoms/settings";
import NumericValue from "@/components/ui/numeric-value";

type NoiseLayerDetailProps = {
  title: string;
  index: number;
};

const NoiseLayerDetail = ({ title, index }: NoiseLayerDetailProps) => {
  const [noiseFilters, setNoiseFilters] = useAtom(noiseFiltersAtom);

  return (
    <Collapsible.Root className="w-full rounded-xl bg-slate-100">
      <Collapsible.Trigger asChild>
        <div className="flex cursor-pointer select-none items-center justify-between px-4 py-3">
          <h4 className="flex items-center gap-2 text-sm font-medium">
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
      <Collapsible.Content className="space-y-2 pb-4 pl-4 pr-4">
        <NumericValue
          value={noiseFilters.at(index)!.strength}
          onValueChange={(value) => {
            setNoiseFilters((noiseFilters) => {
              const updated = [...noiseFilters];
              updated[index].strength = value;

              return updated;
            });
          }}
          step={0.05}
          defaultValue={0.1}
          icon={TargetIcon}
          title="Strength"
        />
        <NumericValue
          value={noiseFilters.at(index)!.roughness}
          onValueChange={(value) => {
            setNoiseFilters((noiseFilters) => {
              const updated = [...noiseFilters];
              updated[index].roughness = value;

              return updated;
            });
          }}
          defaultValue={2}
          step={0.1}
          min={0}
          icon={CrumpledPaperIcon}
          title="Roughness"
        />
        <NumericValue
          value={noiseFilters.at(index)!.baseRoughness}
          onValueChange={(value) => {
            setNoiseFilters((noiseFilters) => {
              const updated = [...noiseFilters];
              updated[index].baseRoughness = value;

              return updated;
            });
          }}
          step={0.1}
          min={0}
          defaultValue={0.7}
          icon={ShadowIcon}
          title="Base Roughness"
        />
        <NumericValue
          value={noiseFilters.at(index)!.minValue}
          onValueChange={(value) => {
            setNoiseFilters((noiseFilters) => {
              const updated = [...noiseFilters];
              updated[index].minValue = value;

              return updated;
            });
          }}
          step={0.1}
          defaultValue={1}
          icon={TextAlignBottomIcon}
          title="Base Elevation"
        />
        <NumericValue
          value={noiseFilters.at(index)!.persistence}
          onValueChange={(value) => {
            setNoiseFilters((noiseFilters) => {
              const updated = [...noiseFilters];
              updated[index].persistence = value;

              return updated;
            });
          }}
          step={0.05}
          defaultValue={0.5}
          icon={BarChartIcon}
          title="Persistence"
        />
        <NumericValue
          value={noiseFilters.at(index)!.layerCount}
          onValueChange={(value) => {
            setNoiseFilters((noiseFilters) => {
              const updated = [...noiseFilters];
              updated[index].layerCount = value;

              return updated;
            });
          }}
          step={1}
          min={0}
          defaultValue={5}
          icon={LayersIcon}
          title="Layer Count"
          type="int"
        />
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default NoiseLayerDetail;
