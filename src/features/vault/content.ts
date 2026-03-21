import type { BrowsePath, BrowsePathGroup, DiyRecipe, FeaturedTrack, IngredientNote, SwapRow } from "./types";

export const INGREDIENT_NOTES: IngredientNote[] = [
  {
    id: "formaldehyde",
    name: "Formaldehyde",
    foundIn: ["Dryer sheets", "Fabric softeners", "Some treated clothing"],
    whyItMatters:
      "IARC Group 1 classified human carcinogen. Linked to asthma, respiratory damage, and long-term cancer risk. Coats clothes and transfers to skin all day.",
    avoid: 'Anything listing "fragrance", fabric softener, dryer sheets',
    swap: "Wool dryer balls, fragrance-free detergent, white vinegar as softener",
  },
  {
    id: "phthalates",
    name: "Phthalates",
    foundIn: [
      "Air fresheners",
      "Fragranced cleaning products",
      "Plastics",
      'Personal care with "fragrance"',
    ],
    whyItMatters:
      "Mimic estrogen in the body. Linked to infertility, early puberty, breast and prostate cancers, and hormone disruption.",
    avoid: 'Any product listing "fragrance" or "parfum"',
    swap: "Fragrance-free everything, essential oils, open windows",
  },
  {
    id: "pfas",
    name: "PFAS / Forever Chemicals",
    foundIn: [
      "Non-stick cookware (Teflon)",
      "Stain-resistant coatings",
      "Some food packaging",
    ],
    whyItMatters:
      "Don't break down in the body or environment. Linked to thyroid disease, kidney and testicular cancers, and infertility.",
    avoid: "Non-stick pans, stain-resistant sprays",
    swap: "Cast iron, stainless steel, uncoated ceramic",
  },
  {
    id: "parabens",
    name: "Parabens",
    foundIn: ["Lotions", "Shampoos", "Conditioners", "Cosmetics"],
    whyItMatters:
      "Preservatives that mimic estrogen. Detected in breast tumor tissue. Linked to infertility and early puberty.",
    avoid: "Methylparaben, propylparaben, butylparaben on ingredient labels",
    swap: "EWG-verified products, Vanicream, unscented natural bars",
  },
  {
    id: "oxybenzone",
    name: "Oxybenzone",
    foundIn: ["Most conventional sunscreens"],
    whyItMatters:
      "Endocrine disruptor. Linked to lower testosterone, fertility problems, thyroid disruption. Also destroys coral reefs.",
    avoid: "Benzophenone-3, oxybenzone on sunscreen labels",
    swap: "Mineral sunscreen with zinc oxide or titanium dioxide only",
  },
  {
    id: "bpa",
    name: "BPA / BPS",
    foundIn: [
      "Plastic water bottles",
      "Food containers",
      "Receipt paper",
      "Canned food linings",
    ],
    whyItMatters:
      "Mimics estrogen. Linked to obesity, infertility, breast and prostate cancers. BPA-free doesn't mean safe — BPS has similar effects.",
    avoid: "Plastic #7, heating food in plastic, touching receipts",
    swap: "Glass or stainless containers, beeswax wrap, decline receipts",
  },
  {
    id: "vocs",
    name: "VOCs",
    foundIn: [
      "Air fresheners",
      "Candles",
      "Cleaning sprays",
      "Conventional paint",
    ],
    whyItMatters:
      "Volatile organic compounds off-gas into your air. Short term: headaches, dizziness. Long term: lung cancer risk, liver damage, nervous system effects.",
    avoid: "Aerosol sprays, plug-in air fresheners, scented candles",
    swap: "HEPA purifier, open windows, essential oil diffuser, simmer pot",
  },
  {
    id: "triclosan",
    name: "Triclosan",
    foundIn: ["Antibacterial soaps", "Some toothpastes"],
    whyItMatters:
      "FDA ruled it not safe or effective. Disrupts gut microbiome, linked to antibiotic resistance and thyroid problems.",
    avoid: 'Any soap labeled "antibacterial"',
    swap: "Plain castile soap — regular soap and water is equally effective",
  },
  {
    id: "quats",
    name: "Quats (Quaternary Ammonium)",
    foundIn: ["Clorox wipes", "Many disinfectant sprays"],
    whyItMatters:
      "Linked to asthma, skin irritation, and reduced fertility in animal studies.",
    avoid: "Benzalkonium chloride, alkyl dimethyl ammonium on labels",
    swap: "DIY all-purpose spray (water + castile soap + tea tree oil)",
  },
  {
    id: "sulfates",
    name: "Sulfates (SLS/SLES)",
    foundIn: ["Most shampoos", "Body washes", "Toothpastes"],
    whyItMatters:
      "Harsh detergents that strip natural oils from skin and scalp. Linked to eczema flares, eye irritation, scalp sensitivity.",
    avoid: "Sodium lauryl sulfate, sodium laureth sulfate",
    swap: "Sulfate-free shampoos, castile-based body wash",
  },
];

export const DIY_RECIPES: DiyRecipe[] = [
  {
    id: "all-purpose",
    name: "All-Purpose Spray",
    ingredients: ["2 cups water", "⅓ tsp mild dish soap", "10 drops tea tree oil"],
    steps: [
      "Add water to a clean spray bottle.",
      "Add dish soap and tea tree oil.",
      "Shake gently to combine.",
      "Use on counters, tables, and windowsills.",
    ],
    notes: "Avoid on natural stone surfaces.",
  },
  {
    id: "glass-spray",
    name: "Glass & Mirror Spray",
    ingredients: ["2 cups water", "3 tbsp white vinegar", "5 tbsp isopropyl alcohol"],
    steps: [
      "Combine all ingredients in a spray bottle.",
      "Shake gently.",
      "Spray on glass or mirrors and wipe with a lint-free cloth.",
    ],
  },
  {
    id: "bathroom-spray",
    name: "Bathroom Spray",
    ingredients: ["2 cups water", "1 cup white vinegar", "2 tsp dish soap"],
    steps: [
      "Mix all ingredients in a spray bottle.",
      "Spray on bathroom surfaces.",
      "Let sit 1–2 minutes, then wipe clean.",
    ],
  },
  {
    id: "laundry-liquid",
    name: "Liquid Laundry Detergent",
    ingredients: [
      "1 bar grated castile soap",
      "1 cup washing soda",
      "½ cup borax",
      "2 gallons hot water",
    ],
    steps: [
      "Grate the castile soap bar.",
      "Dissolve soap in 1 quart hot water.",
      "Add washing soda and borax, stir until dissolved.",
      "Add remaining hot water.",
      "Let cool, pour into storage container.",
      "Use ½ cup per load.",
    ],
  },
  {
    id: "laundry-powder",
    name: "Powder Laundry Detergent",
    ingredients: ["1 cup washing soda", "1 cup borax", "1 grated castile soap bar"],
    steps: [
      "Grate the castile soap bar finely.",
      "Mix all ingredients together.",
      "Store in a sealed container.",
      "Use 2 tbsp per load.",
    ],
  },
  {
    id: "fabric-softener",
    name: "Fabric Softener Alternative",
    ingredients: ["½ cup white vinegar"],
    steps: [
      "Add ½ cup white vinegar to the rinse cycle dispenser.",
      "Run laundry as normal.",
    ],
    notes:
      "Vinegar neutralizes detergent residue and softens fabrics without fragrance.",
  },
  {
    id: "carpet-deodorizer",
    name: "Carpet Deodorizer",
    ingredients: ["1 cup baking soda", "10 drops essential oil (optional)"],
    steps: [
      "Mix baking soda with essential oil if using.",
      "Sprinkle generously over carpet.",
      "Let sit 15 minutes.",
      "Vacuum thoroughly.",
    ],
  },
  {
    id: "dish-soap",
    name: "Dish Soap",
    ingredients: [
      "1 cup liquid castile soap",
      "1 tbsp washing soda",
      "10 drops lemon essential oil",
    ],
    steps: [
      "Combine all ingredients in a squeeze bottle.",
      "Shake gently to mix.",
      "Use as you would regular dish soap.",
    ],
  },
  {
    id: "dishwasher-powder",
    name: "Dishwasher Powder",
    ingredients: [
      "1 cup washing soda",
      "1 cup borax",
      "½ cup salt",
      "½ cup baking soda",
    ],
    steps: [
      "Mix all ingredients together.",
      "Store in a sealed container.",
      "Use 1 tbsp per dishwasher load.",
      "Add white vinegar to the rinse dispenser.",
    ],
  },
  {
    id: "toilet-cleaner",
    name: "Toilet Bowl Cleaner",
    ingredients: ["½ cup baking soda", "¼ cup white vinegar"],
    steps: [
      "Sprinkle baking soda into the toilet bowl.",
      "Pour vinegar over the baking soda.",
      "Let fizz for 5 minutes.",
      "Scrub with a toilet brush.",
      "Flush.",
    ],
  },
  {
    id: "shower-scrub",
    name: "Shower/Tub Scrub",
    ingredients: [
      "1 cup baking soda",
      "¼ cup liquid castile soap",
      "10 drops tea tree oil",
    ],
    steps: [
      "Mix all ingredients into a paste.",
      "Apply to shower or tub surfaces.",
      "Scrub with a sponge or cloth.",
      "Rinse thoroughly.",
    ],
  },
  {
    id: "surface-wipes",
    name: "DIY Surface Wipes",
    ingredients: ["Paper towels or cloth wipes", "1 cup white vinegar", "1 cup water"],
    steps: [
      "Cut paper towels to size or use cloth wipes.",
      "Mix vinegar and water in a container.",
      "Soak wipes in solution.",
      "Store in a sealed container.",
      "Use within 2 weeks.",
    ],
  },
];

export const SWAP_ROWS: SwapRow[] = [
  {
    id: "swap-dryer-sheets",
    item: "Dryer sheets & fabric softener",
    swap: "Wool dryer balls + fragrance-free detergent",
    ingredientNoteId: "formaldehyde",
  },
  {
    id: "swap-air-fresheners",
    item: "Air fresheners & fragranced sprays",
    swap: "Open windows, HEPA purifier, simmer pot",
    ingredientNoteId: "phthalates",
  },
  {
    id: "swap-nonstick",
    item: "Non-stick cookware (Teflon)",
    swap: "Cast iron, stainless steel, uncoated ceramic",
    ingredientNoteId: "pfas",
  },
  {
    id: "swap-lotion",
    item: "Fragranced lotions & shampoos with parabens",
    swap: "EWG-verified or Vanicream products",
    ingredientNoteId: "parabens",
  },
  {
    id: "swap-sunscreen",
    item: "Chemical sunscreen",
    swap: "Mineral sunscreen (zinc oxide or titanium dioxide)",
    ingredientNoteId: "oxybenzone",
  },
  {
    id: "swap-plastic",
    item: "Plastic food containers & water bottles",
    swap: "Glass or stainless steel containers",
    ingredientNoteId: "bpa",
  },
  {
    id: "swap-candles",
    item: "Scented candles & plug-in fresheners",
    swap: "Beeswax candles, essential oil diffuser",
    ingredientNoteId: "vocs",
  },
  {
    id: "swap-antibacterial-soap",
    item: "Antibacterial soap",
    swap: "Plain castile or bar soap",
    ingredientNoteId: "triclosan",
  },
  {
    id: "swap-disinfectant-wipes",
    item: "Disinfectant wipes (Clorox/Lysol)",
    swap: "DIY castile soap + water spray",
    ingredientNoteId: "quats",
  },
  {
    id: "swap-shampoo",
    item: "Standard shampoo & body wash with SLS",
    swap: "Sulfate-free shampoo, castile body wash",
    ingredientNoteId: "sulfates",
  },
];

const BY_CONCERN_GROUPS: BrowsePathGroup[] = [
  {
    label: "Sleep quality",
    description: "Reduce nighttime exposures that interfere with rest and recovery.",
    ingredientNoteIds: ["formaldehyde", "phthalates", "parabens"],
  },
  {
    label: "Skin sensitivity",
    description: "Identify surface-contact triggers in personal care and laundry.",
    ingredientNoteIds: ["parabens", "oxybenzone", "sulfates"],
  },
  {
    label: "Indoor air quality",
    description: "Reduce airborne load from products, furnishings, and cleaning agents.",
    ingredientNoteIds: ["vocs", "formaldehyde", "phthalates"],
  },
  {
    label: "Hormone balance",
    description: "Limit endocrine-disrupting inputs in daily-use products.",
    ingredientNoteIds: ["parabens", "oxybenzone", "bpa", "phthalates"],
  },
  {
    label: "Chemical sensitivity",
    description: "Simplify product stacks to reduce total reactive load.",
    ingredientNoteIds: ["quats", "triclosan", "vocs"],
  },
  {
    label: "Gut + digestive",
    description: "Address food-contact and water sources most linked to gut disruption.",
    ingredientNoteIds: ["bpa", "pfas"],
  },
  {
    label: "Cleaning burden",
    description: "Replace high-residue cleaning agents with lower-load alternatives.",
    ingredientNoteIds: ["quats", "triclosan", "sulfates"],
  },
];

const BY_ROOM_GROUPS: BrowsePathGroup[] = [
  {
    label: "Kitchen",
    description: "Cookware, storage, water, and food-contact priorities.",
    ingredientNoteIds: ["pfas", "bpa", "vocs"],
  },
  {
    label: "Bathroom",
    description: "Personal care, cleaning, and fragrance decisions.",
    ingredientNoteIds: ["parabens", "oxybenzone", "sulfates", "triclosan"],
  },
  {
    label: "Bedroom",
    description: "Bedding, laundry residue, and nighttime air quality.",
    ingredientNoteIds: ["formaldehyde", "phthalates", "parabens"],
  },
  {
    label: "Laundry",
    description: "Detergent, softeners, and fabric residue.",
    ingredientNoteIds: ["quats", "vocs", "sulfates"],
  },
  {
    label: "Living spaces",
    description: "Furniture, candles, air fresheners, and general air load.",
    ingredientNoteIds: ["vocs", "formaldehyde", "phthalates"],
  },
  {
    label: "Personal care + outdoors",
    description: "Sunscreen, skincare, and outdoor product choices.",
    ingredientNoteIds: ["oxybenzone", "parabens", "sulfates"],
  },
];

const BY_BUDGET_GROUPS: BrowsePathGroup[] = [
  {
    label: "Free — habit changes only",
    description: "Ventilate more, reduce spray use, stop air fresheners. No spend required.",
    ingredientNoteIds: ["vocs", "formaldehyde"],
  },
  {
    label: "Under $20 — product swaps",
    description: "Switch cleaning and personal care products to simpler, lower-load alternatives.",
    ingredientNoteIds: ["triclosan", "quats", "sulfates"],
  },
  {
    label: "$20–$100 — targeted upgrades",
    description: "Cookware, water filtration, or a few key personal care replacements.",
    ingredientNoteIds: ["pfas", "bpa", "parabens"],
  },
  {
    label: "$100+ — full category resets",
    description: "Cookware sets, quality filters, or rebuilding a full product category.",
    ingredientNoteIds: ["pfas", "phthalates", "oxybenzone"],
  },
];

export const BROWSE_PATHS: BrowsePath[] = [
  {
    id: "by-concern",
    title: "Browse by Concern",
    summary: "Start from outcomes like sleep, skin sensitivity, or indoor air quality.",
    ingredientNoteIds: ["parabens", "oxybenzone", "bpa", "sulfates", "vocs", "formaldehyde", "phthalates", "quats", "triclosan", "pfas"],
    groups: BY_CONCERN_GROUPS,
  },
  {
    id: "by-room",
    title: "Browse by Room",
    summary: "Room-by-room guidance for kitchen, laundry, bedroom, and air routines.",
    ingredientNoteIds: ["pfas", "vocs", "formaldehyde", "phthalates", "parabens", "oxybenzone", "sulfates", "triclosan", "quats", "bpa"],
    groups: BY_ROOM_GROUPS,
  },
  {
    id: "by-budget",
    title: "Browse by Budget",
    summary: "Find no-cost habit changes, low-cost swaps, and targeted investment upgrades.",
    ingredientNoteIds: ["triclosan", "quats", "vocs", "pfas", "bpa", "parabens", "phthalates", "oxybenzone", "formaldehyde", "sulfates"],
    groups: BY_BUDGET_GROUPS,
  },
];

export const FEATURED_TRACKS: FeaturedTrack[] = [
  {
    id: "air-fragrance",
    title: "Air + Fragrance baseline",
    summary:
      "Build quick boundaries around sprays, candles, and fragrance-heavy inputs.",
    recipeIds: ["all-purpose", "bathroom-spray"],
    ingredientNoteIds: ["vocs", "phthalates", "formaldehyde"],
  },
  {
    id: "kitchen-contact",
    title: "Kitchen contact reset",
    summary:
      "Prioritize cookware and storage swaps that reduce repeat contact.",
    recipeIds: ["dish-soap", "dishwasher-powder"],
    ingredientNoteIds: ["pfas", "bpa"],
  },
  {
    id: "sleep-environment",
    title: "Sleep environment reset",
    summary:
      "Calm nightly exposures and set consistent low-friction sleep defaults.",
    recipeIds: ["laundry-liquid", "fabric-softener"],
    ingredientNoteIds: ["formaldehyde", "phthalates", "parabens"],
  },
  {
    id: "cleaning-simplification",
    title: "Cleaning system simplification",
    summary:
      "Simplify product stacks and routines to reduce hidden repeat triggers.",
    recipeIds: [
      "all-purpose",
      "glass-spray",
      "bathroom-spray",
      "toilet-cleaner",
      "shower-scrub",
      "surface-wipes",
    ],
    ingredientNoteIds: ["quats", "vocs", "triclosan"],
  },
];
