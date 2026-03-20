import { Card } from "@/components/ui/card";
import { ContentStack, InlineGroup } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import { RoadmapItem, ROADMAP_PHASE_LABELS } from "@/features/findings/types";

type ActionDetailViewProps = {
  action: RoadmapItem;
};

export function ActionDetailView({ action }: ActionDetailViewProps) {
  return (
    <Card className="hr-action-detail-card" tone="soft">
      <ContentStack className="hr-action-detail-stack">
        <InlineGroup>
          <Pill tone="accent">{action.category}</Pill>
          <Pill>{ROADMAP_PHASE_LABELS[action.phase]}</Pill>
        </InlineGroup>

        <h4 className="hr-item-title">{action.title}</h4>

        <div className="hr-action-detail-block">
          <p className="hr-field-label">Why It Matters</p>
          <p className="hr-item-description">{action.whyItMatters}</p>
        </div>

        <div className="hr-action-detail-block">
          <p className="hr-field-label">Minimum Step</p>
          <p className="hr-item-description">{action.minimumStep}</p>
        </div>

        <div className="hr-action-detail-block">
          <p className="hr-field-label">Low-Cost Upgrade</p>
          <p className="hr-item-description">{action.lowCostUpgrade}</p>
        </div>

        <div className="hr-action-detail-block">
          <p className="hr-field-label">Premium Upgrade</p>
          <p className="hr-item-description">{action.premiumUpgrade}</p>
        </div>
      </ContentStack>
    </Card>
  );
}
