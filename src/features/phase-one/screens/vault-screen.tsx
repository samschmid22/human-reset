"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScreenContainer } from "@/components/ui/layout";
import { SectionHeader } from "@/components/ui/section-header";
import {
  BROWSE_PATHS,
  DIY_RECIPES,
  FEATURED_TRACKS,
  INGREDIENT_NOTES,
  SWAP_ROWS,
} from "@/features/vault/content";
import type { BrowsePath, BrowsePathGroup, DiyRecipe, FeaturedTrack, IngredientNote } from "@/features/vault/types";
import { cn } from "@/lib/cn";

// ---------------------------------------------------------------------------
// Local types
// ---------------------------------------------------------------------------

type LibraryCategoryView = "ingredient-notes" | "diy-recipes" | "swaps" | "protocols";

type VaultView =
  | { type: "home" }
  | { type: "ingredient"; id: string }
  | { type: "recipe"; id: string }
  | { type: "browse-path"; id: string }
  | { type: "track"; id: string }
  | { type: "library"; category: LibraryCategoryView };

// ---------------------------------------------------------------------------
// Inline icon
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Detail views
// ---------------------------------------------------------------------------

type BackButtonProps = {
  onBack: () => void;
};

function BackButton({ onBack }: BackButtonProps) {
  return (
    <Button className="hr-vault-back-button" onClick={onBack} variant="quiet">
      ← Back
    </Button>
  );
}

type IngredientDetailProps = {
  note: IngredientNote;
  onBack: () => void;
};

function IngredientDetail({ note, onBack }: IngredientDetailProps) {
  return (
    <div className="hr-vault-detail">
      <BackButton onBack={onBack} />
      <h2 className="hr-vault-detail-title">{note.name}</h2>

      <p className="hr-vault-detail-label">Found in</p>
      <ul>
        {note.foundIn.map((item) => (
          <li className="hr-vault-detail-list-item" key={item}>
            {item}
          </li>
        ))}
      </ul>

      <p className="hr-vault-detail-label">Why it matters</p>
      <p className="hr-vault-detail-body">{note.whyItMatters}</p>

      <p className="hr-vault-detail-label">What to avoid</p>
      <p className="hr-vault-detail-body">{note.avoid}</p>

      <div className="hr-vault-swap-block">
        <p className="hr-vault-detail-label">Swap</p>
        <p className="hr-vault-detail-body">{note.swap}</p>
      </div>
    </div>
  );
}

type RecipeDetailProps = {
  recipe: DiyRecipe;
  onBack: () => void;
};

function RecipeDetail({ recipe, onBack }: RecipeDetailProps) {
  return (
    <div className="hr-vault-detail">
      <BackButton onBack={onBack} />
      <h2 className="hr-vault-detail-title">{recipe.name}</h2>

      <p className="hr-vault-detail-label">Ingredients</p>
      <ul>
        {recipe.ingredients.map((ingredient) => (
          <li className="hr-vault-detail-list-item" key={ingredient}>
            {ingredient}
          </li>
        ))}
      </ul>

      <p className="hr-vault-detail-label">Steps</p>
      <ol>
        {recipe.steps.map((step, index) => (
          <li className="hr-vault-detail-list-item" key={index}>
            {step}
          </li>
        ))}
      </ol>

      {recipe.notes ? (
        <>
          <p className="hr-vault-detail-label">Notes</p>
          <p className="hr-vault-detail-body">{recipe.notes}</p>
        </>
      ) : null}
    </div>
  );
}

type BrowsePathDetailProps = {
  browsePath: BrowsePath;
  onBack: () => void;
  onNavigate: (view: VaultView) => void;
};

function renderBrowseGroup(group: BrowsePathGroup, onNavigate: (view: VaultView) => void) {
  const notes = INGREDIENT_NOTES.filter((n) => group.ingredientNoteIds.includes(n.id));
  return (
    <div className="hr-vault-browse-group" key={group.label}>
      <p className="hr-vault-detail-label">{group.label}</p>
      {group.description ? (
        <p className="hr-vault-browse-group-desc">{group.description}</p>
      ) : null}
      <Card className="hr-vault-track-card">
        {notes.map((note, index) => (
          <button
            className={cn("hr-vault-track-row", index > 0 && "has-border")}
            key={note.id}
            onClick={() => onNavigate({ type: "ingredient", id: note.id })}
            type="button"
          >
            <div className="hr-vault-tap-card-body">
              <p className="hr-vault-tap-title">{note.name}</p>
            </div>
            <ChevronRight />
          </button>
        ))}
      </Card>
    </div>
  );
}

function BrowsePathDetail({ browsePath, onBack, onNavigate }: BrowsePathDetailProps) {
  if (browsePath.groups && browsePath.groups.length > 0) {
    return (
      <div className="hr-vault-detail">
        <BackButton onBack={onBack} />
        <h2 className="hr-vault-detail-title">{browsePath.title}</h2>
        <p className="hr-vault-detail-body">{browsePath.summary}</p>
        <div className="hr-vault-browse-groups">
          {browsePath.groups.map((group) => renderBrowseGroup(group, onNavigate))}
        </div>
      </div>
    );
  }

  const linkedNotes = INGREDIENT_NOTES.filter((n) =>
    browsePath.ingredientNoteIds.includes(n.id),
  );

  return (
    <div className="hr-vault-detail">
      <BackButton onBack={onBack} />
      <h2 className="hr-vault-detail-title">{browsePath.title}</h2>
      <p className="hr-vault-detail-body">{browsePath.summary}</p>

      <p className="hr-vault-detail-label">Ingredient Notes</p>
      <Card className="hr-vault-track-card">
        {linkedNotes.map((note, index) => (
          <button
            className={cn("hr-vault-track-row", index > 0 && "has-border")}
            key={note.id}
            onClick={() => onNavigate({ type: "ingredient", id: note.id })}
            type="button"
          >
            <div className="hr-vault-tap-card-body">
              <p className="hr-vault-tap-title">{note.name}</p>
            </div>
            <ChevronRight />
          </button>
        ))}
      </Card>
    </div>
  );
}

type TrackDetailProps = {
  track: FeaturedTrack;
  onBack: () => void;
  onNavigate: (view: VaultView) => void;
};

function TrackDetail({ track, onBack, onNavigate }: TrackDetailProps) {
  const linkedNotes = INGREDIENT_NOTES.filter((n) =>
    track.ingredientNoteIds.includes(n.id),
  );
  const linkedRecipes = DIY_RECIPES.filter((r) => track.recipeIds.includes(r.id));

  return (
    <div className="hr-vault-detail">
      <BackButton onBack={onBack} />
      <h2 className="hr-vault-detail-title">{track.title}</h2>
      <p className="hr-vault-detail-body">{track.summary}</p>

      {linkedNotes.length > 0 ? (
        <>
          <p className="hr-vault-detail-label">Ingredient Notes</p>
          <Card className="hr-vault-track-card">
            {linkedNotes.map((note, index) => (
              <button
                className={cn("hr-vault-track-row", index > 0 && "has-border")}
                key={note.id}
                onClick={() => onNavigate({ type: "ingredient", id: note.id })}
                type="button"
              >
                <div className="hr-vault-tap-card-body">
                  <p className="hr-vault-tap-title">{note.name}</p>
                </div>
                <ChevronRight />
              </button>
            ))}
          </Card>
        </>
      ) : null}

      {linkedRecipes.length > 0 ? (
        <>
          <p className="hr-vault-detail-label">DIY Recipes</p>
          <Card className="hr-vault-track-card">
            {linkedRecipes.map((recipe, index) => (
              <button
                className={cn("hr-vault-track-row", index > 0 && "has-border")}
                key={recipe.id}
                onClick={() => onNavigate({ type: "recipe", id: recipe.id })}
                type="button"
              >
                <div className="hr-vault-tap-card-body">
                  <p className="hr-vault-tap-title">{recipe.name}</p>
                </div>
                <ChevronRight />
              </button>
            ))}
          </Card>
        </>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Library category list views (shown from home category grid)
// ---------------------------------------------------------------------------

type LibraryCategoryDetailProps = {
  category: LibraryCategoryView;
  onBack: () => void;
  onNavigate: (view: VaultView) => void;
};

function LibraryCategoryDetail({ category, onBack, onNavigate }: LibraryCategoryDetailProps) {
  if (category === "ingredient-notes") {
    return (
      <div className="hr-vault-detail">
        <BackButton onBack={onBack} />
        <h2 className="hr-vault-detail-title">Ingredient Notes</h2>
        <Card className="hr-vault-track-card">
          {INGREDIENT_NOTES.map((note, index) => (
            <button
              className={cn("hr-vault-track-row", index > 0 && "has-border")}
              key={note.id}
              onClick={() => onNavigate({ type: "ingredient", id: note.id })}
              type="button"
            >
              <div className="hr-vault-tap-card-body">
                <p className="hr-vault-tap-title">{note.name}</p>
                <p className="hr-vault-tap-summary">{note.foundIn.slice(0, 2).join(", ")}</p>
              </div>
              <ChevronRight />
            </button>
          ))}
        </Card>
      </div>
    );
  }

  if (category === "diy-recipes") {
    return (
      <div className="hr-vault-detail">
        <BackButton onBack={onBack} />
        <h2 className="hr-vault-detail-title">DIY + Low-Cost</h2>
        <Card className="hr-vault-track-card">
          {DIY_RECIPES.map((recipe, index) => (
            <button
              className={cn("hr-vault-track-row", index > 0 && "has-border")}
              key={recipe.id}
              onClick={() => onNavigate({ type: "recipe", id: recipe.id })}
              type="button"
            >
              <div className="hr-vault-tap-card-body">
                <p className="hr-vault-tap-title">{recipe.name}</p>
                <p className="hr-vault-tap-summary">
                  {recipe.ingredients.length} ingredients · {recipe.steps.length} steps
                </p>
              </div>
              <ChevronRight />
            </button>
          ))}
        </Card>
      </div>
    );
  }

  if (category === "swaps") {
    return (
      <div className="hr-vault-detail">
        <BackButton onBack={onBack} />
        <h2 className="hr-vault-detail-title">Swaps Library</h2>
        <Card className="hr-vault-track-card">
          {SWAP_ROWS.map((row, index) => (
            <button
              className={cn("hr-vault-track-row", index > 0 && "has-border")}
              key={row.id}
              onClick={() => {
                if (row.ingredientNoteId) {
                  onNavigate({ type: "ingredient", id: row.ingredientNoteId });
                }
              }}
              type="button"
            >
              <div className="hr-vault-tap-card-body">
                <p className="hr-vault-tap-title">{row.item}</p>
                <p className="hr-vault-tap-summary">Swap: {row.swap}</p>
              </div>
              <ChevronRight />
            </button>
          ))}
        </Card>
      </div>
    );
  }

  // protocols
  return (
    <div className="hr-vault-detail">
      <BackButton onBack={onBack} />
      <h2 className="hr-vault-detail-title">Home Protocols</h2>
      <Card className="hr-vault-track-card">
        {FEATURED_TRACKS.map((track, index) => (
          <button
            className={cn("hr-vault-track-row", index > 0 && "has-border")}
            key={track.id}
            onClick={() => onNavigate({ type: "track", id: track.id })}
            type="button"
          >
            <div className="hr-vault-tap-card-body">
              <p className="hr-vault-tap-title">{track.title}</p>
              <p className="hr-vault-tap-summary">{track.summary}</p>
            </div>
            <ChevronRight />
          </button>
        ))}
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Category entries config
// ---------------------------------------------------------------------------

type CategoryEntry = {
  category: LibraryCategoryView;
  summary: string;
  title: string;
  topics: string;
};

const CATEGORY_ENTRIES: CategoryEntry[] = [
  {
    category: "ingredient-notes",
    summary: "Structured explainers for ingredients, labels, and claims.",
    title: "Ingredient Notes",
    topics: "Red flags · label decoding · what to prioritize",
  },
  {
    category: "diy-recipes",
    summary: "Short practical methods you can apply without full overhauls.",
    title: "DIY + Low-Cost",
    topics: "DIY recipes · no-cost upgrades · minimal-step options",
  },
  {
    category: "swaps",
    summary: "Ingredient and product decisions by room and routine.",
    title: "Swaps Library",
    topics: "Product swaps · safer defaults · quick buying rules",
  },
  {
    category: "protocols",
    summary: "Low-friction protocols to reduce repeated exposure patterns.",
    title: "Home Protocols",
    topics: "Air routines · laundry resets · kitchen setup",
  },
];

// ---------------------------------------------------------------------------
// Home view
// ---------------------------------------------------------------------------

type HomeViewProps = {
  onNavigate: (view: VaultView) => void;
  onOpenCategory: (category: LibraryCategoryView) => void;
};

function HomeView({ onNavigate, onOpenCategory }: HomeViewProps) {
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLowerCase();

  const filteredBrowsePaths =
    normalizedQuery.length === 0
      ? BROWSE_PATHS
      : BROWSE_PATHS.filter(
          (p) =>
            p.title.toLowerCase().includes(normalizedQuery) ||
            p.summary.toLowerCase().includes(normalizedQuery),
        );

  const filteredCategories =
    normalizedQuery.length === 0
      ? CATEGORY_ENTRIES
      : CATEGORY_ENTRIES.filter(
          (c) =>
            c.title.toLowerCase().includes(normalizedQuery) ||
            c.summary.toLowerCase().includes(normalizedQuery) ||
            c.topics.toLowerCase().includes(normalizedQuery),
        );

  const filteredTracks =
    normalizedQuery.length === 0
      ? FEATURED_TRACKS
      : FEATURED_TRACKS.filter(
          (t) =>
            t.title.toLowerCase().includes(normalizedQuery) ||
            t.summary.toLowerCase().includes(normalizedQuery),
        );

  return (
    <>
      <Card className="hr-vault-hero" tone="soft">
        <p className="hr-overline">The Knowledge</p>

        <input
          className="hr-input hr-vault-search"
          onChange={(event) => setQuery(event.currentTarget.value)}
          placeholder="Search topics, protocols, swaps, and ingredient notes"
          type="search"
          value={query}
        />
      </Card>

      <SectionHeader title="Browse Paths" />

      <div className="hr-vault-entry-grid">
        {filteredBrowsePaths.length > 0 ? (
          filteredBrowsePaths.map((path) => (
            <button
              className="hr-vault-tap-card"
              key={path.id}
              onClick={() => onNavigate({ type: "browse-path", id: path.id })}
              type="button"
            >
              <div className="hr-vault-tap-card-body">
                <h3 className="hr-vault-tap-title">{path.title}</h3>
                <p className="hr-vault-tap-summary">{path.summary}</p>
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
        {filteredCategories.length > 0 ? (
          filteredCategories.map((entry) => (
            <button
              className="hr-vault-tap-card"
              key={entry.category}
              onClick={() => onOpenCategory(entry.category)}
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
              className={cn("hr-vault-track-row", index > 0 && "has-border")}
              key={track.id}
              onClick={() => onNavigate({ type: "track", id: track.id })}
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
    </>
  );
}

// ---------------------------------------------------------------------------
// Root screen
// ---------------------------------------------------------------------------

export function VaultScreen() {
  const [viewStack, setViewStack] = useState<VaultView[]>([{ type: "home" }]);
  const currentView = viewStack[viewStack.length - 1];

  function handleNavigate(nextView: VaultView) {
    setViewStack((stack) => [...stack, nextView]);
  }

  function handleOpenCategory(category: LibraryCategoryView) {
    setViewStack((stack) => [...stack, { type: "library", category }]);
  }

  function handleBack() {
    setViewStack((stack) => (stack.length > 1 ? stack.slice(0, -1) : stack));
  }

  function renderContent() {
    if (currentView.type === "home") {
      return (
        <HomeView onNavigate={handleNavigate} onOpenCategory={handleOpenCategory} />
      );
    }

    if (currentView.type === "library") {
      return (
        <LibraryCategoryDetail
          category={currentView.category}
          onBack={handleBack}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentView.type === "ingredient") {
      const note = INGREDIENT_NOTES.find((n) => n.id === currentView.id);
      if (!note) return null;
      return <IngredientDetail note={note} onBack={handleBack} />;
    }

    if (currentView.type === "recipe") {
      const recipe = DIY_RECIPES.find((r) => r.id === currentView.id);
      if (!recipe) return null;
      return <RecipeDetail recipe={recipe} onBack={handleBack} />;
    }

    if (currentView.type === "browse-path") {
      const browsePath = BROWSE_PATHS.find((p) => p.id === currentView.id);
      if (!browsePath) return null;
      return (
        <BrowsePathDetail
          browsePath={browsePath}
          onBack={handleBack}
          onNavigate={handleNavigate}
        />
      );
    }

    if (currentView.type === "track") {
      const track = FEATURED_TRACKS.find((t) => t.id === currentView.id);
      if (!track) return null;
      return (
        <TrackDetail track={track} onBack={handleBack} onNavigate={handleNavigate} />
      );
    }

    return null;
  }

  return (
    <ScreenContainer className="hr-vault-screen">{renderContent()}</ScreenContainer>
  );
}
