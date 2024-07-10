import * as Collapsible from "@radix-ui/react-collapsible";
import * as Checkbox from "@radix-ui/react-checkbox";
import {
  BarChartIcon,
  CheckIcon,
  Crosshair1Icon,
  CrumpledPaperIcon,
  LayersIcon,
  MaskOffIcon,
  MaskOnIcon,
  ResetIcon,
  ShadowIcon,
  TargetIcon,
  TextAlignBottomIcon,
} from "@radix-ui/react-icons";
import { useAtom } from "jotai";
import { noiseFiltersAtom } from "@/atoms/settings";
import NumericValue from "@/components/ui/numeric-value";
import VectorValue from "../ui/vector-value";
import { Vector3 } from "three";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { ArrowsClockwise, WaveSawtooth, WaveSine } from "@phosphor-icons/react";
import cn from "@/lib/cn";
import { RidgidNoiseFilter, SimpleNoiseFilter } from "@/lib/noise";
import { VECTOR_ZERO } from "@/lib/vector";
import ToggleValue from "../ui/toggle-value";

type NoiseLayerDetailProps = {
  title: string;
  index: number;
};

const NoiseLayerDetail = ({ title, index }: NoiseLayerDetailProps) => {
  const [noiseFilters, setNoiseFilters] = useAtom(noiseFiltersAtom);

  return (
    <Collapsible.Root className="w-full rounded-xl border bg-slate-100">
      <Collapsible.Trigger asChild>
        <div className="flex cursor-pointer select-none items-center justify-between px-4 py-3">
          <header className="flex items-center gap-3">
            <h4 className="text-sm font-medium">
              <span>{title}</span>
            </h4>
            <span
              onClick={(e) => {
                e.stopPropagation();
                setNoiseFilters((noiseFilters) => {
                  const updated = [...noiseFilters];
                  updated[index] =
                    noiseFilters.at(index) instanceof RidgidNoiseFilter
                      ? new SimpleNoiseFilter({
                          enabled: noiseFilters.at(index)!.enabled,
                          strength: noiseFilters.at(index)!.strength,
                          roughness: noiseFilters.at(index)!.roughness,
                          baseRoughness: noiseFilters.at(index)!.baseRoughness,
                          center: noiseFilters.at(index)!.center,
                          persistence: noiseFilters.at(index)!.persistence,
                          minValue: noiseFilters.at(index)!.minValue,
                          layerCount: noiseFilters.at(index)!.layerCount,
                          useFirstLayerAsMask:
                            noiseFilters.at(index)!.useFirstLayerAsMask,
                        })
                      : new RidgidNoiseFilter({
                          enabled: noiseFilters.at(index)!.enabled,
                          strength: noiseFilters.at(index)!.strength,
                          roughness: noiseFilters.at(index)!.roughness,
                          baseRoughness: noiseFilters.at(index)!.baseRoughness,
                          center: noiseFilters.at(index)!.center,
                          persistence: noiseFilters.at(index)!.persistence,
                          minValue: noiseFilters.at(index)!.minValue,
                          layerCount: noiseFilters.at(index)!.layerCount,
                          useFirstLayerAsMask:
                            noiseFilters.at(index)!.useFirstLayerAsMask,
                        });

                  return updated;
                });
              }}
              className="flex items-center gap-1 rounded-full border bg-white px-2 py-0.5 text-xs font-light text-slate-600"
            >
              {noiseFilters.at(index) instanceof RidgidNoiseFilter
                ? "Ridge"
                : "Simple"}
            </span>
          </header>

          <div className="flex items-center gap-2">
            <Checkbox.Root
              onClick={(e) => e.stopPropagation()}
              className="flex size-5 items-center justify-center rounded border bg-white"
              checked={noiseFilters.at(index)?.enabled}
              onCheckedChange={(checked) => {
                setNoiseFilters((noiseFilters) => {
                  const updated = [...noiseFilters];
                  updated[index].enabled = checked as boolean;

                  return updated;
                });
              }}
            >
              <Checkbox.Indicator asChild>
                <CheckIcon />
              </Checkbox.Indicator>
            </Checkbox.Root>
          </div>
        </div>
      </Collapsible.Trigger>
      <Collapsible.Content
        className={cn("space-y-2 pb-4 pl-4 pr-4 transition-opacity", {
          "pointer-events-none opacity-60": !noiseFilters.at(index)?.enabled,
        })}
      >
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
          step={0.05}
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
          step={0.05}
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
          step={0.05}
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
          step={0.01}
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
        <div className="h-0.5" aria-hidden></div>

        {index !== 0 && (
          <>
            <ToggleValue
              title="First Layer As Mask?"
              value={noiseFilters.at(index)?.useFirstLayerAsMask}
              onValueChange={(value) => {
                setNoiseFilters((noiseFilters) => {
                  const updated = [...noiseFilters];
                  updated[index].useFirstLayerAsMask = value;

                  return updated;
                });
              }}
              labels={{
                on: "On",
                off: "Off",
              }}
              icon={MaskOffIcon}
            />
            <div className="h-0.5" aria-hidden></div>
          </>
        )}

        <VectorValue
          title="Noise Center"
          value={noiseFilters.at(index)?.center as Vector3}
          onValueChange={(value) => {
            setNoiseFilters((noiseFilters) => {
              const updated = [...noiseFilters];
              updated[index].center = value;

              return updated;
            });
          }}
          icon={Crosshair1Icon}
          step={0.05}
        />
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default NoiseLayerDetail;
