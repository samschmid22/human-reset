import { Card } from "@/components/ui/card";
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
    <div className="hr-onb-pace-wrap">
      <div className="hr-onb-pace-chips">
        {pacePresets.map((preset) => {
          const config = PACE_PRESET_CONFIG[preset];
          const isSelected = preset === selectedPreset;
          return (
            <button
              className={cn("hr-onb-pace-chip", isSelected && "is-selected")}
              key={preset}
              onClick={() => onPresetSelect(preset)}
              type="button"
            >
              <span className="hr-onb-pace-chip-label">{config.label}</span>
              <span className="hr-onb-pace-chip-range">{config.rangeLabel}</span>
              <span className="hr-onb-pace-chip-desc">{config.description}</span>
            </button>
          );
        })}
      </div>

      <Card tone="soft" className="hr-onb-slider-card-inner">
        <p className="hr-onb-slider-section-label">Fine-tune</p>
        <div className="hr-range-row">
          <input
            className="hr-range"
            max={10}
            min={1}
            onChange={(event) => onActionsPerDayChange(Number(event.target.value))}
            type="range"
            value={actionsPerDay}
          />
          <span className="hr-onb-slider-value">{actionsPerDay}/day</span>
        </div>
      </Card>
    </div>
  );
}
