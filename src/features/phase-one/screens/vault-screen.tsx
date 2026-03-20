import { Card } from "@/components/ui/card";
import { ContentStack, ScreenContainer } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";

const categoryEntries = [
  {
    summary: "Ingredient and product decisions by room and routine.",
    title: "Swaps Library",
    topics: "Product swaps • safer defaults • quick buying rules",
  },
  {
    summary: "Low-friction protocols to reduce repeated exposure patterns.",
    title: "Home Protocols",
    topics: "Air routines • laundry resets • kitchen setup",
  },
  {
    summary: "Structured explainers for ingredients, labels, and claims.",
    title: "Ingredient Notes",
    topics: "Red flags • label decoding • what to prioritize",
  },
  {
    summary: "Short practical methods you can apply without full overhauls.",
    title: "DIY + Low-Cost",
    topics: "DIY recipes • no-cost upgrades • minimal-step options",
  },
];

const featuredTracks = [
  "Air + Fragrance baseline",
  "Kitchen contact reset",
  "Sleep environment reset",
  "Cleaning system simplification",
];

export function VaultScreen() {
  return (
    <ScreenContainer className="hr-vault-screen">
      <Card className="hr-vault-hero" tone="soft">
        <div className="hr-card-row">
          <div>
            <p className="hr-overline">Vault</p>
            <h2 className="hr-feature-title">Calm guidance for confident home decisions</h2>
            <p className="hr-copy">
              Turn insight into practical action with clear protocols, safer swaps, and grounded explanations.
            </p>
          </div>
          <div className="hr-vault-hero-stats">
            <span>Categories: {categoryEntries.length}</span>
            <span>Tracks: {featuredTracks.length}</span>
          </div>
        </div>

        <div className="hr-vault-search-shell" role="status">
          Search guidance, protocols, swaps, and ingredient notes
        </div>
      </Card>

      <SectionHeader title="Library Categories" />

      <div className="hr-vault-category-grid">
        {categoryEntries.map((entry) => (
          <Card className="hr-vault-category-card" key={entry.title}>
            <h3 className="hr-item-title">{entry.title}</h3>
            <p className="hr-item-description">{entry.summary}</p>
            <p className="hr-vault-topic-line">{entry.topics}</p>
          </Card>
        ))}
      </div>

      <SectionHeader title="Featured Tracks" />

      <Card className="hr-vault-track-card">
        <ContentStack className="hr-vault-track-list">
          {featuredTracks.map((track) => (
            <div className="hr-vault-track-row" key={track}>
              <div>
                <h3 className="hr-item-title">{track}</h3>
                <p className="hr-item-description">Curated set of topic pages and related action guidance.</p>
              </div>
              <span className="hr-vault-row-link">Open</span>
            </div>
          ))}
        </ContentStack>
      </Card>
    </ScreenContainer>
  );
}
