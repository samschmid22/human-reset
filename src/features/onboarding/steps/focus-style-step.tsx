import { Card } from "@/components/ui/card";
import { ContentStack } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import { FocusStyle } from "@/features/onboarding/types";
import { cn } from "@/lib/cn";

type FocusStyleStepProps = {
  focusStyle: FocusStyle;
  onFocusStyleChange: (value: FocusStyle) => void;
};

const focusStyles: Array<{ description: string; id: FocusStyle; label: string; tag: string }> = [
  {
    description: "Blend categories each day for balanced progress across your environment.",
    id: "mixed",
    label: "Mixed Categories",
    tag: "Default",
  },
  {
    description: "Stay in one category per day to keep focus narrow and simple.",
    id: "one_category",
    label: "One Category / Day",
    tag: "Single-track",
  },
];

export function FocusStyleStep({ focusStyle, onFocusStyleChange }: FocusStyleStepProps) {
  return (
    <ContentStack>
      <Card>
        <p className="hr-field-label">Choose Focus Style</p>
        <div className="hr-option-grid">
          {focusStyles.map((option) => {
            const isSelected = option.id === focusStyle;

            return (
              <button
                className={cn("hr-option-card", isSelected && "is-selected")}
                key={option.id}
                onClick={() => onFocusStyleChange(option.id)}
                type="button"
              >
                <div className="hr-option-header">
                  <h3 className="hr-item-title">{option.label}</h3>
                  <Pill tone={isSelected ? "accent" : "neutral"}>{option.tag}</Pill>
                </div>
                <p className="hr-item-description">{option.description}</p>
              </button>
            );
          })}
        </div>
      </Card>
    </ContentStack>
  );
}
