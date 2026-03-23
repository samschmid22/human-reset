import { cn } from "@/lib/cn";

type PreferencesStepProps = {
  onToggleSensitivity: (value: string) => void;
  selectedSensitivities: string[];
  sensitivityDefaults: string[];
};

export function PreferencesStep({
  onToggleSensitivity,
  selectedSensitivities,
  sensitivityDefaults,
}: PreferencesStepProps) {
  return (
    <div className="hr-onb-select-card">
      {sensitivityDefaults.map((option) => {
        const isSelected = selectedSensitivities.includes(option);
        return (
          <button
            className={cn("hr-onb-select-row", isSelected && "is-selected")}
            key={option}
            onClick={() => onToggleSensitivity(option)}
            type="button"
          >
            <span className="hr-onb-select-check" aria-hidden="true">
              {isSelected ? (
                <svg fill="none" height="12" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="12">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : null}
            </span>
            <span className="hr-onb-select-label">{option}</span>
          </button>
        );
      })}
    </div>
  );
}
