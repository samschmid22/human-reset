import { Card } from "@/components/ui/card";
import { ContentStack, ScreenContainer } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";

const entryPoints = [
  {
    summary: "Room-by-room guidance for kitchen, laundry, bedroom, and air routines.",
    title: "Browse by Room",
  },
  {
    summary: "Start from outcomes like sleep, stress load, or sensitivity support.",
    title: "Browse by Concern",
  },
  {
    summary: "Find minimum step, low-cost, and premium pathways in one place.",
    title: "Browse by Budget",
  },
];

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
  {
    summary: "Build quick boundaries around sprays, candles, and fragrance-heavy inputs.",
    title: "Air + Fragrance baseline",
  },
  {
    summary: "Prioritize cookware and storage swaps that reduce repeat contact.",
    title: "Kitchen contact reset",
  },
  {
    summary: "Calm nightly exposures and set consistent low-friction sleep defaults.",
    title: "Sleep environment reset",
  },
  {
    summary: "Simplify product stacks and routines to reduce hidden repeat triggers.",
    title: "Cleaning system simplification",
  },
];

export function VaultScreen() {
  return (
    <ScreenContainer className="hr-vault-screen">
      <Card className="hr-vault-hero" tone="soft">
        <div className="hr-card-row">
          <div>
            <p className="hr-overline">Vault Library</p>
            <h2 className="hr-feature-title">Curated guidance for your reset system</h2>
            <p className="hr-copy">
              Structured education for clear decisions, practical swaps, and stable routines.
            </p>
          </div>
          <div className="hr-vault-hero-stats">
            <span>Categories: {categoryEntries.length}</span>
            <span>Tracks: {featuredTracks.length}</span>
            <span>Paths: {entryPoints.length}</span>
          </div>
        </div>

        <div className="hr-vault-search-shell" role="status">
          Search topics, protocols, swaps, and ingredient notes
        </div>
      </Card>

      <SectionHeader subtitle="Choose the navigation style that fits how you make decisions." title="Browse Paths" />

      <div className="hr-vault-entry-grid">
        {entryPoints.map((entry) => (
          <Card className="hr-vault-entry-card" key={entry.title}>
            <h3 className="hr-item-title">{entry.title}</h3>
            <p className="hr-item-description">{entry.summary}</p>
          </Card>
        ))}
      </div>

      <SectionHeader subtitle="Core knowledge architecture for product and routine decisions." title="Library Categories" />

      <div className="hr-vault-category-grid">
        {categoryEntries.map((entry) => (
          <Card className="hr-vault-category-card" key={entry.title}>
            <h3 className="hr-item-title">{entry.title}</h3>
            <p className="hr-item-description">{entry.summary}</p>
            <p className="hr-vault-topic-line">{entry.topics}</p>
          </Card>
        ))}
      </div>

      <SectionHeader subtitle="Curated sets of related guidance pages and action contexts." title="Featured Track Collections" />

      <Card className="hr-vault-track-card">
        <ContentStack className="hr-vault-track-list">
          {featuredTracks.map((track) => (
            <div className="hr-vault-track-row" key={track.title}>
              <div>
                <h3 className="hr-item-title">{track.title}</h3>
                <p className="hr-item-description">{track.summary}</p>
              </div>
              <span className="hr-vault-row-link">Open</span>
            </div>
          ))}
        </ContentStack>
      </Card>
    </ScreenContainer>
  );
}
