import { FocusStyle } from "@/features/onboarding/types";
import { cn } from "@/lib/cn";

type FocusStyleStepProps = {
  focusStyle: FocusStyle;
  onFocusStyleChange: (value: FocusStyle) => void;
};

const focusOptions: Array<{ description: string; id: FocusStyle; label: string }> = [
  {
    description: "Blend categories each day for balanced progress.",
    id: "mixed",
    label: "Mixed",
  },
  {
    description: "Stay in one category per day to keep focus narrow.",
    id: "one_category",
    label: "One Category",
  },
];

export function FocusStyleStep({ focusStyle, onFocusStyleChange }: FocusStyleStepProps) {
  return (
    <div className="hr-onb-focus-buttons">
      {focusOptions.map((option) => {
        const isSelected = option.id === focusStyle;
        return (
          <button
            className={cn("hr-onb-focus-btn", isSelected && "is-selected")}
            key={option.id}
            onClick={() => onFocusStyleChange(option.id)}
            type="button"
          >
            <span className="hr-onb-focus-btn-label">{option.label}</span>
            <span className="hr-onb-focus-btn-desc">{option.description}</span>
          </button>
        );
      })}
    </div>
  );
}
