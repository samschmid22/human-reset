export type IngredientNote = {
  id: string;
  name: string;
  foundIn: string[];
  whyItMatters: string;
  avoid: string;
  swap: string;
};

export type DiyRecipe = {
  id: string;
  name: string;
  ingredients: string[];
  steps: string[];
  notes?: string;
};

export type SwapRow = {
  id: string;
  item: string;
  swap: string;
  ingredientNoteId?: string;
};

export type BrowsePath = {
  id: string;
  title: string;
  summary: string;
  ingredientNoteIds: string[];
};

export type FeaturedTrack = {
  id: string;
  title: string;
  summary: string;
  recipeIds: string[];
  ingredientNoteIds: string[];
};
