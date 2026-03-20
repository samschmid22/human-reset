import { Card } from "@/components/ui/card";
import { ContentStack, InlineGroup, ScreenContainer } from "@/components/ui/layout";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";

const vaultTopics = [
  "DIY recipes",
  "Product swaps",
  "Ingredient red flags",
  "Ventilation + air routines",
  "Water setup guides",
  "Kitchen and storage protocols",
];

export function VaultScreen() {
  return (
    <ScreenContainer>
      <SectionHeader subtitle="Structured knowledge base with searchable topic pages." title="Vault" />

      <Card tone="soft">
        <p className="hr-field-label">Vault Search</p>
        <div className="hr-search-placeholder" role="status">
          Search placeholder (content indexing added in later phase)
        </div>
      </Card>

      <SectionHeader subtitle="Topic architecture placeholder cards." title="Core Topics" />

      <ContentStack>
        {vaultTopics.map((topic) => (
          <Card key={topic}>
            <h3 className="hr-item-title">{topic}</h3>
            <p className="hr-item-description">
              Placeholder topic entry with verdict, why, swaps, and related actions.
            </p>
            <InlineGroup>
              <Pill>Topic Page</Pill>
              <Pill>Docs-backed</Pill>
            </InlineGroup>
          </Card>
        ))}
      </ContentStack>
    </ScreenContainer>
  );
}
