import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, InlineGroup, ScreenContainer } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { FindingsRoadmapResult } from "@/features/findings/types";
import { OnboardingState } from "@/features/onboarding/types";

type ProfileScreenProps = {
  onboardingState: OnboardingState;
  onRecalculateRoadmap: () => void;
  report: FindingsRoadmapResult;
};

function formatList(values: string[]): string {
  if (values.length === 0) {
    return "Not set";
  }

  return values.join(", ");
}

export function ProfileScreen({ onboardingState, onRecalculateRoadmap, report }: ProfileScreenProps) {
  const responses = onboardingState.responses;

  return (
    <ScreenContainer>
      {report.findings.length === 0 ? (
        <Card className="hr-empty-state" tone="soft">
          <p className="hr-empty-title">Profile is saved locally</p>
          <p className="hr-empty-copy">
            Complete quizzes to generate findings and roadmap priorities using your saved settings.
          </p>
        </Card>
      ) : (
        <Card className="hr-empty-state" tone="soft">
          <p className="hr-empty-title">Profile-guided roadmap is active</p>
          <p className="hr-empty-copy">
            Your pace, focus style, and sensitivities are currently shaping priority ranking.
          </p>
          <InlineGroup>
            <Pill tone="accent">{report.findings.length} findings</Pill>
            <Pill>{report.priorities.length} actions</Pill>
          </InlineGroup>
        </Card>
      )}

      <SectionHeader subtitle="Local-only settings in v1 (no login required)." title="Profile" />

      <ContentStack>
        <Card>
          <p className="hr-field-label">Name</p>
          <p className="hr-field-value">Optional (not captured in current onboarding flow)</p>
        </Card>

        <Card>
          <p className="hr-field-label">Concerns</p>
          <p className="hr-field-value">{formatList(responses.concerns)}</p>
        </Card>

        <Card>
          <p className="hr-field-label">Custom Concern</p>
          <p className="hr-field-value">
            {responses.customConcern.trim().length > 0 ? responses.customConcern : "Not set"}
          </p>
        </Card>

        <Card>
          <p className="hr-field-label">Pace</p>
          <p className="hr-field-value">
            {responses.actionsPerDay} actions/day ({responses.pacePreset})
          </p>
        </Card>

        <Card>
          <p className="hr-field-label">Focus Style</p>
          <p className="hr-field-value">
            {responses.focusStyle === "one_category" ? "One category/day" : "Mixed categories"}
          </p>
        </Card>

        <Card>
          <p className="hr-field-label">Sensitivities</p>
          <p className="hr-field-value">{formatList(responses.sensitivities)}</p>
        </Card>

        <Card>
          <p className="hr-field-label">Notifications</p>
          <p className="hr-field-value">{responses.notificationsEnabled ? "On" : "Off"}</p>
        </Card>
      </ContentStack>

      <Card tone="soft">
        <InlineGroup>
          <Pill>
            Daily plan: {report.dailyPlan.actions.length}/{report.dailyPlan.maxActions}
          </Pill>
          <Pill>
            Top category: {report.highestPriorityCategory ?? "Not available yet"}
          </Pill>
        </InlineGroup>
        <Button onClick={onRecalculateRoadmap} variant="secondary">
          Recalculate Roadmap
        </Button>
      </Card>
    </ScreenContainer>
  );
}
