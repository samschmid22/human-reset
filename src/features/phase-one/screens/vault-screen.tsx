import { useMemo, useState } from "react";

import { Card } from "@/components/ui/card";
import { ScreenContainer } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import { cn } from "@/lib/cn";

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
    topics: "Product swaps · safer defaults · quick buying rules",
  },
  {
    summary: "Low-friction protocols to reduce repeated exposure patterns.",
    title: "Home Protocols",
    topics: "Air routines · laundry resets · kitchen setup",
  },
  {
    summary: "Structured explainers for ingredients, labels, and claims.",
    title: "Ingredient Notes",
    topics: "Red flags · label decoding · what to prioritize",
  },
  {
    summary: "Short practical methods you can apply without full overhauls.",
    title: "DIY + Low-Cost",
    topics: "DIY recipes · no-cost upgrades · minimal-step options",
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

function ChevronRight() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="16"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

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

  return (
    <ScreenContainer className="hr-vault-screen">
      <Card className="hr-vault-hero" tone="soft">
        <p className="hr-overline">Vault Library</p>
        <h2 className="hr-feature-title">Curated guidance for your reset system</h2>
        <p className="hr-copy">
          Structured education for practical swaps, clear routines, and lower-friction decisions.
        </p>

        <div className="hr-vault-search-shell">
          <input
            className="hr-input"
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search topics, protocols, swaps, and ingredient notes"
            type="search"
            value={query}
          />
        </div>
      </Card>

      {activeItem ? (
        <div className="hr-vault-active-strip">
          <span className="hr-vault-active-label">Viewing:</span>
          <strong className="hr-vault-active-title">{activeItem}</strong>
          <button
            className="hr-vault-active-close"
            onClick={() => setActiveItem(null)}
            type="button"
          >
            ✕
          </button>
        </div>
      ) : null}

      <SectionHeader title="Browse Paths" />

      <div className="hr-vault-entry-grid">
        {filteredEntryPoints.length > 0 ? (
          filteredEntryPoints.map((entry) => (
            <button
              className={cn("hr-vault-tap-card", activeItem === entry.title && "is-active")}
              key={entry.title}
              onClick={() => setActiveItem(entry.title)}
              type="button"
            >
              <div className="hr-vault-tap-card-body">
                <h3 className="hr-vault-tap-title">{entry.title}</h3>
                <p className="hr-vault-tap-summary">{entry.summary}</p>
              </div>
              <ChevronRight />
            </button>
          ))
        ) : (
          <Card className="hr-empty-state" tone="soft">
            <p className="hr-empty-title">No browse paths match your search</p>
            <p className="hr-empty-copy">Try a broader term like swaps or protocol.</p>
          </Card>
        )}
      </div>

      <SectionHeader title="Library Categories" />

      <div className="hr-vault-category-grid">
        {filteredCategoryEntries.length > 0 ? (
          filteredCategoryEntries.map((entry) => (
            <button
              className={cn("hr-vault-tap-card", activeItem === entry.title && "is-active")}
              key={entry.title}
              onClick={() => setActiveItem(entry.title)}
              type="button"
            >
              <div className="hr-vault-tap-card-body">
                <h3 className="hr-vault-tap-title">{entry.title}</h3>
                <p className="hr-vault-tap-summary">{entry.summary}</p>
                <p className="hr-vault-tap-topics">{entry.topics}</p>
              </div>
              <ChevronRight />
            </button>
          ))
        ) : (
          <Card className="hr-empty-state" tone="soft">
            <p className="hr-empty-title">No categories match your search</p>
            <p className="hr-empty-copy">Try a term like ingredients or DIY.</p>
          </Card>
        )}
      </div>

      <SectionHeader title="Featured Tracks" />

      <Card className="hr-vault-track-card">
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track, index) => (
            <button
              className={cn(
                "hr-vault-track-row",
                index > 0 && "has-border",
                activeItem === track.title && "is-active",
              )}
              key={track.title}
              onClick={() => setActiveItem(track.title)}
              type="button"
            >
              <div className="hr-vault-tap-card-body">
                <h3 className="hr-vault-tap-title">{track.title}</h3>
                <p className="hr-vault-tap-summary">{track.summary}</p>
              </div>
              <ChevronRight />
            </button>
          ))
        ) : (
          <p className="hr-empty-copy">No featured tracks match your search.</p>
        )}
      </Card>
    </ScreenContainer>
  );
}
