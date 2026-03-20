import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, ScreenContainer } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { getPlanMaturity } from "@/features/findings/plan-maturity";
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

type SettingRowProps = {
  label: string;
  value: string;
};

function SettingRow({ label, value }: SettingRowProps) {
  return (
    <div className="hr-setting-row">
      <span className="hr-setting-label">{label}</span>
      <span className="hr-setting-value">{value}</span>
    </div>
  );
}

export function ProfileScreen({ onboardingState, onRecalculateRoadmap, report }: ProfileScreenProps) {
  const responses = onboardingState.responses;
  const planReady = report.priorities.length > 0;
  const maturity = getPlanMaturity(report.completedQuizCount, report.totalQuizCount);

  return (
    <ScreenContainer className="hr-profile-screen">
      <Card className="hr-profile-hero" tone="soft">
        <div className="hr-card-row">
          <div>
            <p className="hr-overline">Profile</p>
            <h2 className="hr-feature-title">
              {planReady ? "Your reset profile is actively guiding the plan" : "Your reset profile is saved locally"}
            </h2>
            <p className="hr-copy">{maturity.summary}</p>
          </div>
          <div className="hr-profile-hero-stats">
            <span>{maturity.badge}</span>
            <span>{report.completedQuizCount}/{report.totalQuizCount} categories</span>
            <span>{report.priorities.length} actions</span>
          </div>
        </div>
      </Card>

      <SectionHeader subtitle="Adjust preferences, pace, and context that shape roadmap generation." title="Profile + Plan Settings" />

      <div className="hr-profile-grid">
        <Card>
          <h3 className="hr-item-title">Goals + Concerns</h3>
          <ContentStack className="hr-setting-stack">
            <SettingRow label="Concerns" value={formatList(responses.concerns)} />
            <SettingRow
              label="Specific goal"
              value={responses.customConcern.trim().length > 0 ? responses.customConcern : "Not set"}
            />
          </ContentStack>
        </Card>

        <Card>
          <h3 className="hr-item-title">Plan Style</h3>
          <ContentStack className="hr-setting-stack">
            <SettingRow label="Pace" value={`${responses.actionsPerDay} actions/day (${responses.pacePreset})`} />
            <SettingRow
              label="Focus style"
              value={responses.focusStyle === "one_category" ? "One category/day" : "Mixed categories"}
            />
            <SettingRow label="Notifications" value={responses.notificationsEnabled ? "Enabled" : "Off"} />
          </ContentStack>
        </Card>

        <Card>
          <h3 className="hr-item-title">Sensitivity Context</h3>
          <ContentStack className="hr-setting-stack">
            <SettingRow label="Sensitivities" value={formatList(responses.sensitivities)} />
            <SettingRow label="Additional" value={formatList(responses.additionalSensitivities)} />
          </ContentStack>
        </Card>

        <Card>
          <h3 className="hr-item-title">System Snapshot</h3>
          <ContentStack className="hr-setting-stack">
            <SettingRow
              label="Daily plan"
              value={`${report.dailyPlan.actions.length}/${report.dailyPlan.maxActions} scheduled`}
            />
            <SettingRow
              label="Top category"
              value={report.highestPriorityCategory ?? "Not available yet"}
            />
            <Button onClick={onRecalculateRoadmap} variant="secondary">
              Recalculate Roadmap
            </Button>
          </ContentStack>
        </Card>
      </div>
    </ScreenContainer>
  );
}
