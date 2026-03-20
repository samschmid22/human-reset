import { Card } from "@/components/ui/card";
import { ContentStack } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import { PACE_PRESET_CONFIG } from "@/features/onboarding/constants";
import { PacePreset } from "@/features/onboarding/types";
import { cn } from "@/lib/cn";

type PaceStepProps = {
  actionsPerDay: number;
  onActionsPerDayChange: (value: number) => void;
  onPresetSelect: (preset: PacePreset) => void;
  selectedPreset: PacePreset;
};

const pacePresets: PacePreset[] = ["recovery", "standard", "intensive", "sprint"];

export function PaceStep({
  actionsPerDay,
  onActionsPerDayChange,
  onPresetSelect,
  selectedPreset,
}: PaceStepProps) {
  return (
    <ContentStack>
      <Card>
        <p className="hr-field-label">Pace Presets</p>
        <div className="hr-option-grid">
          {pacePresets.map((preset) => {
            const config = PACE_PRESET_CONFIG[preset];
            const isSelected = preset === selectedPreset;

            return (
              <button
                className={cn("hr-option-card", isSelected && "is-selected")}
                key={preset}
                onClick={() => onPresetSelect(preset)}
                type="button"
              >
                <div className="hr-option-header">
                  <h3 className="hr-item-title">{config.label}</h3>
                  <Pill tone={isSelected ? "accent" : "neutral"}>{config.rangeLabel}</Pill>
                </div>
                <p className="hr-item-description">{config.description}</p>
              </button>
            );
          })}
        </div>
      </Card>

      <Card tone="soft">
        <p className="hr-field-label">Actions Per Day</p>
        <div className="hr-range-row">
          <input
            className="hr-range"
            max={10}
            min={1}
            onChange={(event) => onActionsPerDayChange(Number(event.target.value))}
            type="range"
            value={actionsPerDay}
          />
          <Pill tone="accent">{actionsPerDay} actions/day</Pill>
        </div>
        <p className="hr-item-description">v1 range is capped at 1-10 actions/day.</p>
      </Card>
    </ContentStack>
  );
}
