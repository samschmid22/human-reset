import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { ContentStack, InlineGroup } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/cn";

type ConcernsStepProps = {
  concerns: string[];
  customConcern: string;
  onCustomConcernChange: (value: string) => void;
  onToggleConcern: (concern: string) => void;
  options: string[];
};

export function ConcernsStep({
  concerns,
  customConcern,
  onCustomConcernChange,
  onToggleConcern,
  options,
}: ConcernsStepProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
      return options;
    }

    return options.filter((option) => option.toLowerCase().includes(normalizedQuery));
  }, [options, searchQuery]);

  return (
    <ContentStack className="hr-onboarding-step-stack">
      <Card className="hr-onboarding-search-card" tone="soft">
        <p className="hr-field-label">Search Concerns</p>
        <input
          aria-label="Search concerns"
          className="hr-input hr-onboarding-search-input"
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search outcomes (sleep, energy, skin, stress...)"
          type="search"
          value={searchQuery}
        />
      </Card>

      <Card className="hr-onboarding-chip-card">
        <InlineGroup>
          <Pill tone="accent">{concerns.length} selected</Pill>
          <Pill>Multi-select</Pill>
        </InlineGroup>

        <div className="hr-chip-grid">
          {filteredOptions.map((concern) => {
            const isSelected = concerns.includes(concern);

            return (
              <button
                className={cn("hr-toggle-chip", isSelected && "is-selected")}
                key={concern}
                onClick={() => onToggleConcern(concern)}
                type="button"
              >
                {concern}
              </button>
            );
          })}
        </div>

        {filteredOptions.length === 0 ? (
          <p className="hr-empty-copy">No concerns match your search.</p>
        ) : null}
      </Card>

      <Card className="hr-onboarding-textarea-card" tone="soft">
        <p className="hr-field-label">I&apos;m Here For Something Specific</p>
        <textarea
          className="hr-input hr-textarea hr-onboarding-textarea"
          maxLength={180}
          onChange={(event) => onCustomConcernChange(event.target.value)}
          placeholder="Optional: add your specific concern in your own words."
          rows={3}
          value={customConcern}
        />
      </Card>
    </ContentStack>
  );
}
