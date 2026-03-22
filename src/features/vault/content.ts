import type { BrowsePath, BrowsePathGroup, DiyRecipe, FeaturedTrack, IngredientNote, SwapRow } from "./types";

export const INGREDIENT_NOTES: IngredientNote[] = [
  {
    id: "formaldehyde",
    name: "Formaldehyde",
    foundIn: ["Dryer sheets", "Fabric softeners"],
    whyItMatters:
      "Known human carcinogen (IARC Group 1). Causes asthma, headaches, and long-term cancer risk.",
    avoid: "Dryer sheets, fabric softeners, anything listing \"fragrance\"",
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
      "Mimic hormones. Linked to infertility, birth defects, early puberty, and breast and prostate cancers. These chemicals hijack your hormones so your body thinks it's in chaos.",
    avoid: 'Any product listing "fragrance" or "parfum"',
    swap: "Fragrance-free everything, essential oils, open windows",
  },
  {
    id: "pfas",
    name: "PFAS / Forever Chemicals",
    foundIn: [
      "Non-stick cookware (Teflon)",
    ],
    whyItMatters:
      "Can stay in the body for a very long time. Linked to thyroid disease, infertility, and kidney and testicular cancers.",
    avoid: "Non-stick pans",
    swap: "Cast iron, stainless steel, uncoated ceramic",
  },
  {
    id: "parabens",
    name: "Parabens",
    foundIn: ["Lotions", "Shampoos", "Conditioners", "Cosmetics"],
    whyItMatters:
      "Preservatives that mimic estrogen. Detected in breast tumor tissue. Linked to breast cancer, infertility, and early puberty.",
    avoid: "Methylparaben, propylparaben, butylparaben on ingredient labels",
    swap: "EWG-verified products, Vanicream, unscented natural bars",
  },
  {
    id: "oxybenzone",
    name: "Oxybenzone",
    foundIn: ["Most conventional sunscreens"],
    whyItMatters:
      "Endocrine disruptor. Linked to lower testosterone, fertility problems, and thyroid issues. Also destroys coral reefs.",
    avoid: "Benzophenone-3, oxybenzone on sunscreen labels",
    swap: "Mineral sunscreen with zinc oxide or titanium dioxide only — no oxybenzone or avobenzone",
  },
  {
    id: "bpa",
    name: "BPA / BPS",
    foundIn: [
      "Plastic water bottles",
      "Food containers",
      "Receipt paper (thermal paper)",
    ],
    whyItMatters:
      "Estrogen mimics. Linked to infertility, breast and prostate cancers, and obesity. BPA-free doesn't mean safe — BPS shows similar endocrine activity.",
    avoid: "Plastic containers, heating food in plastic, touching receipts",
    swap: "Glass or stainless steel containers, beeswax wrap, decline receipts or wash hands after handling",
  },
  {
    id: "vocs",
    name: "VOCs",
    foundIn: [
      "Air fresheners",
      "Candles",
      "Cleaning sprays",
    ],
    whyItMatters:
      "Volatile organic compounds off-gas into your air. Short-term: airway irritation, headaches, dizziness. Long-term: increased risk of lung cancer, liver damage, nervous system breakdown.",
    avoid: "Aerosol sprays, plug-in air fresheners, scented candles",
    swap: "HEPA purifier, open windows daily, essential oils, simmer pot",
  },
  {
    id: "triclosan",
    name: "Triclosan",
    foundIn: ["Antibacterial soaps", "Some toothpastes"],
    whyItMatters:
      "FDA ruled it not generally recognized as safe or effective. Weakens the immune system by killing good bacteria. Linked to antibiotic resistance and thyroid problems.",
    avoid: 'Any soap labeled "antibacterial"',
    swap: "Plain castile soap — regular soap and water is equally effective",
  },
  {
    id: "quats",
    name: "Quats (Quaternary Ammonium)",
    foundIn: ["Clorox wipes", "Many disinfectant sprays"],
    whyItMatters:
      "Linked to asthma, skin irritation, and decreased sperm count.",
    avoid: "Benzalkonium chloride, alkyl dimethyl ammonium on labels",
    swap: "DIY all-purpose spray (water + castile soap + tea tree oil)",
  },
  {
    id: "sulfates",
    name: "Sulfates (SLS/SLES)",
    foundIn: ["Most shampoos", "Body washes", "Toothpastes"],
    whyItMatters:
      "Harsh detergents that strip natural oils. Linked to skin irritation, eczema, and eye damage.",
    avoid: "Sodium lauryl sulfate, sodium laureth sulfate",
    swap: "Sulfate-free shampoos, castile-based body wash",
  },
  {
    id: "fragrance",
    name: "Fragrance / Parfum",
    foundIn: [
      "Air fresheners",
      "Laundry detergents",
      "Personal care products",
      "Cleaning sprays",
    ],
    whyItMatters:
      "A trade-secret umbrella that can hide dozens to hundreds of chemicals. Often includes phthalates — hormone disruptors linked to infertility and breast and prostate cancers. Fragrance-free is the cleanest filter.",
    avoid: 'Any product listing "fragrance" or "parfum" on the label',
    swap: "Fragrance-free products, essential oils, open windows",
  },
  {
    id: "artificial-sweeteners",
    name: "Artificial Sweeteners",
    foundIn: ["Diet sodas", "Sugar-free products", "Some protein bars"],
    whyItMatters:
      "Destroy gut microbiome — linked to bloating, IBS, and anxiety. Trick the brain into increasing cravings, leading to weight gain. Linked to depression and mood disorders.",
    avoid: "Aspartame, sucralose, acesulfame K on ingredient labels",
    swap: "Water, whole fruit, small amounts of real sugar",
  },
  {
    id: "food-dyes",
    name: "Food Dyes",
    foundIn: ["Candies", "Cereals", "Drinks", "Some yogurts"],
    whyItMatters:
      "Disrupt brain function — linked to hyperactivity, mood swings, and behavior changes in children. Can cause allergic reactions and migraines.",
    avoid: "Red 40, Yellow 5, Blue 1 on ingredient labels",
    swap: "Whole foods with no added color, products colored with fruit or vegetable extracts",
  },
  {
    id: "seed-oils",
    name: "Seed Oils",
    foundIn: [
      "Ultra-processed foods",
      "Restaurant frying oils",
      "Most packaged snacks",
    ],
    whyItMatters:
      "Polyunsaturated omega-6 fats that are prone to oxidation. When heated hard or reused (deep frying), they produce toxic byproducts. The problem is the pattern: processed food plus frying plus constant exposure.",
    avoid: "Canola, soybean, sunflower, and corn oil in fried or processed foods",
    swap: "Butter, ghee, olive oil, avocado oil — stable under heat",
  },
];

export const DIY_RECIPES: DiyRecipe[] = [
  {
    id: "all-purpose",
    name: "All-Purpose Spray",
    ingredients: ["2 cups water", "⅓ tsp mild dish soap", "10 drops tea tree or lemon essential oil (optional)"],
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
    id: "stainless-spray",
    name: "Stainless Steel Spray",
    ingredients: ["2 cups water", "½ cup isopropyl alcohol", "⅛–¼ tsp mild dish soap"],
    steps: [
      "Combine all ingredients in a spray bottle.",
      "Shake gently.",
      "Spray on stainless steel surfaces and wipe with a microfiber cloth.",
    ],
    notes: "Buff in the direction of the grain for streak-free results.",
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
  {
    id: "swap-fragrance",
    item: 'Fragranced personal care and cleaning products with "fragrance" or "parfum"',
    swap: "Fragrance-free products, essential oils",
    ingredientNoteId: "fragrance",
  },
  {
    id: "swap-artificial-sweeteners",
    item: "Diet sodas, sugar-free products, and protein bars with artificial sweeteners",
    swap: "Water, sparkling water, whole fruit, small amounts of real sugar",
    ingredientNoteId: "artificial-sweeteners",
  },
  {
    id: "swap-food-dyes",
    item: "Artificially colored foods — candies, cereals, drinks",
    swap: "Whole foods, products colored with fruit or vegetable extracts",
    ingredientNoteId: "food-dyes",
  },
  {
    id: "swap-seed-oils",
    item: "Canola, soybean, sunflower, and corn oil in fried and processed foods",
    swap: "Butter, ghee, olive oil, or avocado oil",
    ingredientNoteId: "seed-oils",
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
    ingredientNoteIds: ["vocs", "formaldehyde", "phthalates", "fragrance"],
  },
  {
    label: "Hormone balance",
    description: "Limit endocrine-disrupting inputs in daily-use products.",
    ingredientNoteIds: ["parabens", "oxybenzone", "bpa", "phthalates", "fragrance"],
  },
  {
    label: "Chemical sensitivity",
    description: "Simplify product stacks to reduce total reactive load.",
    ingredientNoteIds: ["quats", "triclosan", "vocs"],
  },
  {
    label: "Gut + digestive",
    description: "Address food-contact, water sources, and food additives most linked to gut disruption.",
    ingredientNoteIds: ["bpa", "pfas", "artificial-sweeteners"],
  },
  {
    label: "Cleaning burden",
    description: "Replace high-residue cleaning agents with lower-load alternatives.",
    ingredientNoteIds: ["quats", "triclosan", "sulfates"],
  },
  {
    label: "Food inputs",
    description: "Reduce everyday food additives and industrial oils linked to gut disruption and inflammation.",
    ingredientNoteIds: ["artificial-sweeteners", "food-dyes", "seed-oils"],
  },
];

const BY_ROOM_GROUPS: BrowsePathGroup[] = [
  {
    label: "Kitchen",
    description: "Cookware, storage, water, and food-contact priorities.",
    ingredientNoteIds: ["pfas", "bpa", "vocs", "seed-oils", "artificial-sweeteners"],
  },
  {
    label: "Bathroom",
    description: "Personal care, cleaning, and fragrance decisions.",
    ingredientNoteIds: ["parabens", "oxybenzone", "sulfates", "triclosan", "fragrance"],
  },
  {
    label: "Bedroom",
    description: "Bedding, laundry residue, and nighttime air quality.",
    ingredientNoteIds: ["formaldehyde", "phthalates", "parabens"],
  },
  {
    label: "Laundry",
    description: "Detergent, softeners, and fabric residue.",
    ingredientNoteIds: ["quats", "vocs", "sulfates", "fragrance"],
  },
  {
    label: "Living spaces",
    description: "Furniture, candles, air fresheners, and general air load.",
    ingredientNoteIds: ["vocs", "formaldehyde", "phthalates", "fragrance"],
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
    description: "Ventilate more, reduce spray use, stop air fresheners, and cut sweeteners. No spend required.",
    ingredientNoteIds: ["vocs", "formaldehyde", "artificial-sweeteners", "food-dyes"],
  },
  {
    label: "Under $20 — product swaps",
    description: "Switch cleaning and personal care products to simpler, lower-load alternatives.",
    ingredientNoteIds: ["triclosan", "quats", "sulfates", "fragrance", "seed-oils"],
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
    ingredientNoteIds: ["parabens", "oxybenzone", "bpa", "sulfates", "vocs", "formaldehyde", "phthalates", "quats", "triclosan", "pfas", "fragrance", "artificial-sweeteners", "food-dyes", "seed-oils"],
    groups: BY_CONCERN_GROUPS,
  },
  {
    id: "by-room",
    title: "Browse by Room",
    summary: "Room-by-room guidance for kitchen, laundry, bedroom, and air routines.",
    ingredientNoteIds: ["pfas", "vocs", "formaldehyde", "phthalates", "parabens", "oxybenzone", "sulfates", "triclosan", "quats", "bpa", "fragrance", "seed-oils", "artificial-sweeteners"],
    groups: BY_ROOM_GROUPS,
  },
  {
    id: "by-budget",
    title: "Browse by Budget",
    summary: "Find no-cost habit changes, low-cost swaps, and targeted investment upgrades.",
    ingredientNoteIds: ["triclosan", "quats", "vocs", "pfas", "bpa", "parabens", "phthalates", "oxybenzone", "formaldehyde", "sulfates", "fragrance", "artificial-sweeteners", "food-dyes", "seed-oils"],
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
    ingredientNoteIds: ["vocs", "phthalates", "formaldehyde", "fragrance"],
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
    id: "food-inputs",
    title: "Food inputs reset",
    summary:
      "Identify and remove the most common food additives and industrial oils linked to gut disruption, mood changes, and inflammation.",
    recipeIds: [],
    ingredientNoteIds: ["artificial-sweeteners", "food-dyes", "seed-oils"],
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
