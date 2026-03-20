import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
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
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLowerCase();
  const filteredEntryPoints = useMemo(() => {
    if (normalizedQuery.length === 0) {
      return entryPoints;
    }

    return entryPoints.filter((entry) => {
      return (
        entry.title.toLowerCase().includes(normalizedQuery) ||
        entry.summary.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [normalizedQuery]);

  const filteredCategoryEntries = useMemo(() => {
    if (normalizedQuery.length === 0) {
      return categoryEntries;
    }

    return categoryEntries.filter((entry) => {
      return (
        entry.title.toLowerCase().includes(normalizedQuery) ||
        entry.summary.toLowerCase().includes(normalizedQuery) ||
        entry.topics.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [normalizedQuery]);

  const filteredTracks = useMemo(() => {
    if (normalizedQuery.length === 0) {
      return featuredTracks;
    }

    return featuredTracks.filter((track) => {
      return (
        track.title.toLowerCase().includes(normalizedQuery) ||
        track.summary.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [normalizedQuery]);

  const activeSummary =
    entryPoints.find((entry) => entry.title === activeItem)?.summary ??
    categoryEntries.find((entry) => entry.title === activeItem)?.summary ??
    featuredTracks.find((track) => track.title === activeItem)?.summary ??
    null;

  return (
    <ScreenContainer className="hr-vault-screen">
      <Card className="hr-vault-hero" tone="soft">
        <div>
          <div>
            <p className="hr-overline">Vault Library</p>
            <h2 className="hr-feature-title">Curated guidance for your reset system</h2>
            <p className="hr-copy">
              Structured education for practical swaps, clear routines, and lower-friction decisions.
            </p>
          </div>
        </div>

        <div className="hr-vault-search-shell">
          <input
            className="hr-input"
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search topics, protocols, swaps, and ingredient notes"
            type="search"
            value={query}
          />
          <p className="hr-vault-search-meta">
            {filteredEntryPoints.length + filteredCategoryEntries.length + filteredTracks.length} matches
          </p>
        </div>
      </Card>

      {activeItem && activeSummary ? (
        <Card className="hr-vault-active-card" tone="accent">
          <p className="hr-overline">Now viewing</p>
          <h3 className="hr-item-title">{activeItem}</h3>
          <p className="hr-item-description">{activeSummary}</p>
        </Card>
      ) : null}

      <SectionHeader subtitle="Choose the navigation style that fits how you make decisions." title="Browse Paths" />

      <div className="hr-vault-entry-grid">
        {filteredEntryPoints.length > 0 ? (
          filteredEntryPoints.map((entry) => (
            <Card className="hr-vault-entry-card" key={entry.title}>
              <h3 className="hr-item-title">{entry.title}</h3>
              <p className="hr-item-description">{entry.summary}</p>
              <Button onClick={() => setActiveItem(entry.title)} size="sm" variant="quiet">
                Open
              </Button>
            </Card>
          ))
        ) : (
          <Card className="hr-empty-state" tone="soft">
            <p className="hr-empty-title">No browse paths match your search</p>
            <p className="hr-empty-copy">Try a broader term like swaps or protocol.</p>
          </Card>
        )}
      </div>

      <SectionHeader subtitle="Core knowledge architecture for product and routine decisions." title="Library Categories" />

      <div className="hr-vault-category-grid">
        {filteredCategoryEntries.length > 0 ? (
          filteredCategoryEntries.map((entry) => (
            <Card className="hr-vault-category-card" key={entry.title}>
              <h3 className="hr-item-title">{entry.title}</h3>
              <p className="hr-item-description">{entry.summary}</p>
              <p className="hr-vault-topic-line">{entry.topics}</p>
              <Button onClick={() => setActiveItem(entry.title)} size="sm" variant="quiet">
                Open
              </Button>
            </Card>
          ))
        ) : (
          <Card className="hr-empty-state" tone="soft">
            <p className="hr-empty-title">No categories match your search</p>
            <p className="hr-empty-copy">Try a term like ingredients or DIY.</p>
          </Card>
        )}
      </div>

      <SectionHeader subtitle="Curated sets of related guidance pages and action contexts." title="Featured Track Collections" />

      <Card className="hr-vault-track-card">
        <ContentStack className="hr-vault-track-list">
          {filteredTracks.length > 0 ? (
            filteredTracks.map((track) => (
              <div className="hr-vault-track-row" key={track.title}>
                <div>
                  <h3 className="hr-item-title">{track.title}</h3>
                  <p className="hr-item-description">{track.summary}</p>
                </div>
                <Button onClick={() => setActiveItem(track.title)} size="sm" variant="quiet">
                  Open
                </Button>
              </div>
            ))
          ) : (
            <p className="hr-empty-copy">No featured tracks match your search.</p>
          )}
        </ContentStack>
      </Card>
    </ScreenContainer>
  );
}
