import { Card } from "@/components/ui/card";
import { ContentStack } from "@/components/ui/layout";
import { RoadmapItem, ROADMAP_PHASE_LABELS } from "@/features/findings/types";

type ActionDetailViewProps = {
  action: RoadmapItem;
  onDonePermanent?: () => void;
};

export function ActionDetailView({ action, onDonePermanent }: ActionDetailViewProps) {
  return (
    <Card className="hr-action-detail-card" tone="soft">
      <ContentStack className="hr-action-detail-stack">
        <p className="hr-action-detail-meta">
          {action.category} • {ROADMAP_PHASE_LABELS[action.phase]}
        </p>
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
        {onDonePermanent ? (
          <button className="hr-action-detail-permanent" onClick={onDonePermanent} type="button">
            Mark as permanently complete — remove from plan
          </button>
        ) : null}
      </ContentStack>
    </Card>
  );
}
