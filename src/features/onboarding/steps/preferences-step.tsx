import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, InlineGroup } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import { cn } from "@/lib/cn";

type PreferencesStepProps = {
  additionalSensitivities: string[];
  notificationsEnabled: boolean;
  onAddSensitivity: (value: string) => void;
  onNotificationPreferenceChange: (value: boolean) => void;
  onRemoveAdditionalSensitivity: (value: string) => void;
  onToggleSensitivity: (value: string) => void;
  selectedSensitivities: string[];
  sensitivityDefaults: string[];
};

export function PreferencesStep({
  additionalSensitivities,
  notificationsEnabled,
  onAddSensitivity,
  onNotificationPreferenceChange,
  onRemoveAdditionalSensitivity,
  onToggleSensitivity,
  selectedSensitivities,
  sensitivityDefaults,
}: PreferencesStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [newSensitivity, setNewSensitivity] = useState("");

  const allSensitivityOptions = useMemo(
    () => [...sensitivityDefaults, ...additionalSensitivities],
    [additionalSensitivities, sensitivityDefaults],
  );

  const filteredOptions = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
      return allSensitivityOptions;
    }

    return allSensitivityOptions.filter((option) => option.toLowerCase().includes(normalizedQuery));
  }, [allSensitivityOptions, searchQuery]);

  function handleAddSensitivity() {
    const normalized = newSensitivity.trim().toLowerCase();

    if (normalized.length === 0) {
      return;
    }

    onAddSensitivity(normalized);
    setNewSensitivity("");
    setSearchQuery("");
  }

  return (
    <ContentStack className="hr-onboarding-step-stack">
      <Card className="hr-onboarding-search-card" tone="soft">
        <p className="hr-field-label">Search Sensitivities</p>
        <input
          aria-label="Search sensitivities"
          className="hr-input hr-onboarding-search-input"
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search and select sensitivity inputs..."
          type="search"
          value={searchQuery}
        />
      </Card>

      <Card className="hr-onboarding-chip-card">
        <InlineGroup>
          <Pill tone="accent">{selectedSensitivities.length} selected</Pill>
          <Pill>Editable later</Pill>
        </InlineGroup>

        <div className="hr-chip-grid">
          {filteredOptions.map((option) => {
            const isSelected = selectedSensitivities.includes(option);

            return (
              <button
                className={cn("hr-toggle-chip", isSelected && "is-selected")}
                key={option}
                onClick={() => onToggleSensitivity(option)}
                type="button"
              >
                {option}
              </button>
            );
          })}
        </div>
      </Card>

      <Card className="hr-onboarding-search-card" tone="soft">
        <p className="hr-field-label">Add Another Sensitivity</p>
        <div className="hr-inline-input-row">
          <input
            className="hr-input"
            maxLength={64}
            onChange={(event) => setNewSensitivity(event.target.value)}
            placeholder="Add custom sensitivity..."
            type="text"
            value={newSensitivity}
          />
          <Button onClick={handleAddSensitivity} size="sm" variant="secondary">
            Add
          </Button>
        </div>

        {additionalSensitivities.length > 0 ? (
          <InlineGroup>
            {additionalSensitivities.map((item) => (
              <button
                className="hr-removable-chip"
                key={item}
                onClick={() => onRemoveAdditionalSensitivity(item)}
                type="button"
              >
                {item} ×
              </button>
            ))}
          </InlineGroup>
        ) : null}
      </Card>

      <Card className="hr-onboarding-chip-card">
        <p className="hr-field-label">Preference</p>
        <div className="hr-option-grid hr-option-grid--compact">
          <button
            className={cn("hr-option-card", notificationsEnabled && "is-selected")}
            onClick={() => onNotificationPreferenceChange(true)}
            type="button"
          >
            <h3 className="hr-item-title">Notifications On</h3>
            <p className="hr-item-description">Optional reminders to support consistency.</p>
          </button>
          <button
            className={cn("hr-option-card", !notificationsEnabled && "is-selected")}
            onClick={() => onNotificationPreferenceChange(false)}
            type="button"
          >
            <h3 className="hr-item-title">Notifications Off</h3>
            <p className="hr-item-description">You can enable this later in Profile settings.</p>
          </button>
        </div>
      </Card>
    </ContentStack>
  );
}
