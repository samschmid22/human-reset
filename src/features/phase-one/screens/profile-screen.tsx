import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, InlineGroup, ScreenContainer } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";

const profileFields = [
  { label: "Name", value: "Optional" },
  { label: "Concerns", value: "Multi-select" },
  { label: "Pace", value: "3 actions/day" },
  { label: "Focus Style", value: "Mixed categories" },
  { label: "Sensitivities", value: "Configurable" },
  { label: "Skipped Items", value: "Manager placeholder" },
];

export function ProfileScreen() {
  return (
    <ScreenContainer>
      <SectionHeader subtitle="Local-only settings in v1 (no login required)." title="Profile" />

      <ContentStack>
        {profileFields.map((field) => (
          <Card key={field.label}>
            <p className="hr-field-label">{field.label}</p>
            <p className="hr-field-value">{field.value}</p>
          </Card>
        ))}
      </ContentStack>

      <Card tone="soft">
        <InlineGroup>
          <Pill>Notifications (Optional)</Pill>
          <Pill>Local Persistence</Pill>
        </InlineGroup>
        <Button variant="secondary">Recalculate Roadmap (Placeholder)</Button>
      </Card>
    </ScreenContainer>
  );
}
