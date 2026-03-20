import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, InlineGroup, ScreenContainer } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";

const todaysActions = [
  {
    description: "Evaluate your indoor air and identify common pollutant sources.",
    duration: "15 min",
    title: "Assess Home Air Quality",
  },
  {
    description: "Use your filtered water baseline for all drinking and hot beverages.",
    duration: "10 min",
    title: "Water Filter Baseline",
  },
  {
    description: "Switch one high-use product to a fragrance-free option from your lineup.",
    duration: "12 min",
    title: "Personal Care Swap",
  },
];

export function HomeScreen() {
  return (
    <ScreenContainer>
      <Card tone="accent">
        <ContentStack>
          <InlineGroup>
            <Pill tone="accent">Today&apos;s Focus</Pill>
            <Pill>Mixed Categories</Pill>
          </InlineGroup>
          <h2 className="hr-feature-title">Reduce Environmental Toxins</h2>
          <p className="hr-copy">
            Begin with immediate surroundings. Small, practical changes create a more stable
            baseline for the rest of the roadmap.
          </p>
        </ContentStack>
      </Card>

      <SectionHeader
        subtitle="Placeholder action cards for Phase 1 shell wiring."
        title="Today&apos;s Actions"
      />

      <ContentStack>
        {todaysActions.map((action) => (
          <Card key={action.title}>
            <div className="hr-card-row">
              <div>
                <h3 className="hr-item-title">{action.title}</h3>
                <p className="hr-item-description">{action.description}</p>
              </div>
              <Pill tone="success">{action.duration}</Pill>
            </div>
            <InlineGroup>
              <Button size="sm" variant="secondary">
                Done
              </Button>
              <Button size="sm" variant="quiet">
                Snooze
              </Button>
              <Button size="sm" variant="quiet">
                Details
              </Button>
            </InlineGroup>
          </Card>
        ))}
      </ContentStack>

      <SectionHeader
        subtitle="Progress reflects roadmap completion, not quiz scores."
        title="Your Progress"
      />

      <Card>
        <div className="hr-progress-row">
          <div className="hr-progress-ring">
            <strong>12%</strong>
            <span>Complete</span>
          </div>
          <div className="hr-progress-copy">
            <p className="hr-item-description">Roadmap completion placeholder</p>
            <InlineGroup>
              <Pill>4 days active</Pill>
              <Pill>3 categories started</Pill>
            </InlineGroup>
          </div>
        </div>
      </Card>
    </ScreenContainer>
  );
}
