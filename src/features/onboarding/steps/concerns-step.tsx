import { cn } from "@/lib/cn";

type ConcernsStepProps = {
  concerns: string[];
  onToggleConcern: (concern: string) => void;
  options: string[];
};

export function ConcernsStep({ concerns, onToggleConcern, options }: ConcernsStepProps) {
  return (
    <div className="hr-onb-select-card">
      {options.map((concern) => {
        const isSelected = concerns.includes(concern);
        return (
          <button
            className={cn("hr-onb-select-row", isSelected && "is-selected")}
            key={concern}
            onClick={() => onToggleConcern(concern)}
            type="button"
          >
            <span className="hr-onb-select-check" aria-hidden="true">
              {isSelected ? (
                <svg fill="none" height="12" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" width="12">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : null}
            </span>
            <span className="hr-onb-select-label">{concern}</span>
          </button>
        );
      })}
    </div>
  );
}
