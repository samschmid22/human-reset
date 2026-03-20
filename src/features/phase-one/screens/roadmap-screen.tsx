import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, InlineGroup, ScreenContainer } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";

const priorityItems = [
  {
    category: "Air + Fragrance",
    title: "Remove plug-ins and automatic air fresheners",
  },
  {
    category: "Cleaning Sprays",
    title: "Replace disinfectant aerosols with targeted non-aerosol cleaning",
  },
  {
    category: "Water",
    title: "Use filtered water for drinking and cooking",
  },
];

const roadmapPhases = [
  "Stop biggest exposures",
  "Stabilize baseline",
  "Swap defaults",
  "Upgrade environment",
  "Maintain",
];

export function RoadmapScreen() {
  return (
    <ScreenContainer>
      <SectionHeader
        subtitle="Generated from findings after quiz completion (placeholder list in Phase 1)."
        title="By Priority"
      />

      <ContentStack>
        {priorityItems.map((item) => (
          <Card key={item.title}>
            <InlineGroup>
              <Pill tone="accent">{item.category}</Pill>
            </InlineGroup>
            <h3 className="hr-item-title">{item.title}</h3>
            <p className="hr-item-description">
              Placeholder roadmap item card with action wiring in a later phase.
            </p>
            <Button size="sm" variant="quiet">
              View Details
            </Button>
          </Card>
        ))}
      </ContentStack>

      <SectionHeader
        subtitle="Dynamic phase progression from the product doc."
        title="By Phase"
      />

      <Card tone="soft">
        <InlineGroup>
          {roadmapPhases.map((phase) => (
            <Pill key={phase}>{phase}</Pill>
          ))}
        </InlineGroup>
      </Card>
    </ScreenContainer>
  );
}
