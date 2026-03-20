import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ContentStack, ScreenContainer } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";

const quizCategories = [
  "Air + Fragrance",
  "Cleaning Sprays + Wipes",
  "Laundry",
  "Personal Care",
  "Water",
  "Pest Control",
  "Food Reset",
  "Cookware + Food Storage",
  "Sleep Environment",
  "Mind + Stress",
];

export function QuizzesScreen() {
  return (
    <ScreenContainer>
      <Card className="hr-empty-state" tone="soft">
        <p className="hr-empty-title">No quizzes started yet</p>
        <p className="hr-empty-copy">
          Start with any category. Responses will feed findings and roadmap ranking in later phases.
        </p>
      </Card>

      <SectionHeader
        subtitle="Structured inputs only. No user-facing score visuals in v1."
        title="Category Quizzes"
      />

      <ContentStack>
        {quizCategories.map((quiz) => (
          <Card key={quiz}>
            <div className="hr-card-row">
              <div>
                <h3 className="hr-item-title">{quiz}</h3>
                <p className="hr-item-description">10 questions • one question per screen (phase 2)</p>
              </div>
              <Pill>Not Started</Pill>
            </div>
            <Button size="sm" variant="secondary">
              Open Placeholder
            </Button>
          </Card>
        ))}
      </ContentStack>
    </ScreenContainer>
  );
}
