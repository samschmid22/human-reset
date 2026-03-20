import { FindingActionTemplate } from "@/features/findings/types";
import { QuizDefinition, QuizQuestion } from "@/features/quizzes/types";

type QuizActionTemplateMap = Record<string, Record<string, FindingActionTemplate>>;

const SEEDED_ACTION_TEMPLATES: QuizActionTemplateMap = {
  "air-fragrance": {
    q1: {
      title: "Remove plug-ins and automatic air fresheners",
      whyItMatters: "Continuous fragrance devices can keep indoor exposure patterns elevated.",
      minimumStep: "Unplug fragrance devices and pause room fragrance gels for 14 days.",
      lowCostUpgrade: "Use ventilation and simple odor-control basics in high-use areas.",
      premiumUpgrade: "Pair the reset with a bedroom HEPA purifier for a cleaner baseline.",
      feasibility: 1.24,
      triggerOnHighAnswer: true,
    },
    q2: {
      title: "Reduce combustion-based fragrance sources",
      whyItMatters: "Frequent burning can add recurring indoor air load.",
      minimumStep: "Limit candles/incense to occasional use and ventilate while in use.",
      lowCostUpgrade: "Shift ambiance to non-combustion options for most days.",
      premiumUpgrade: "If burning is kept, run purifier support in the same room.",
      feasibility: 1.02,
      triggerOnHighAnswer: true,
    },
    q3: {
      title: "Stop dryer sheets and scent boosters",
      whyItMatters: "Laundry fragrance can create repeated contact through clothes and bedding.",
      minimumStep: "Pause dryer sheets and scent boosters for the next two weeks.",
      lowCostUpgrade: "Use wool dryer balls and fragrance-free detergent defaults.",
      premiumUpgrade: "Add a full bedding and towel laundry reset routine.",
      feasibility: 1.18,
      triggerOnHighAnswer: true,
    },
    q4: {
      title: "Remove fabric softener from default laundry",
      whyItMatters: "Fabric softener can reinforce repetitive fragrance contact.",
      minimumStep: "Stop fabric softener and monitor comfort for 14 days.",
      lowCostUpgrade: "Use a simplified non-fragrance softening approach instead.",
      premiumUpgrade: "Pair with a complete laundry system reset.",
      feasibility: 1.16,
      triggerOnHighAnswer: true,
    },
    q5: {
      title: "Simplify personal care fragrance load",
      whyItMatters: "Daily personal care can become a high-frequency fragrance pathway.",
      minimumStep: "Pause perfume/cologne and replace one daily-use product this week.",
      lowCostUpgrade: "Swap your top two high-use items to fragrance-free options.",
      premiumUpgrade: "Run a 30-day full lineup reset for hair/body/lotion products.",
      feasibility: 1.08,
      triggerOnHighAnswer: true,
    },
    q6: {
      title: "Use unscented cleaning as the default",
      whyItMatters: "Frequent scented spray use can keep exposure patterns active indoors.",
      minimumStep: "Pause scented routine sprays and use unscented alternatives.",
      lowCostUpgrade: "Create a simple two-product unscented cleaning system.",
      premiumUpgrade: "Add deeper tools (like steam cleaning) where it fits your routine.",
      feasibility: 1.14,
      triggerOnHighAnswer: true,
    },
    q7: {
      title: "Remove room spray and odor masking habits",
      whyItMatters: "Odor masking products can add repeated fragrance exposure.",
      minimumStep: "Stop room sprays for 14 days and test ventilation-first alternatives.",
      lowCostUpgrade: "Use targeted odor source cleanup instead of masking products.",
      premiumUpgrade: "Add purifier support in frequently used rooms.",
      feasibility: 1.22,
      triggerOnHighAnswer: true,
    },
    q8: {
      title: "Establish a daily ventilation habit",
      whyItMatters: "Consistent fresh-air exchange helps stabilize indoor air quality baseline.",
      minimumStep: "Open windows for 5-10 minutes daily when conditions allow.",
      lowCostUpgrade: "Use kitchen and bathroom fan routines with the ventilation habit.",
      premiumUpgrade: "Add simple indoor humidity/air checks for better timing.",
      feasibility: 1.26,
      triggerOnHighAnswer: false,
    },
    q9: {
      title: "Track symptom-linked fragrance patterns",
      whyItMatters: "Observed sensitivity patterns can help prioritize practical exposure swaps.",
      minimumStep: "Log when symptoms and fragrance exposure appear together for 2 weeks.",
      lowCostUpgrade: "Use your log to remove top triggering products first.",
      premiumUpgrade: "Create a stricter home fragrance protocol for shared spaces.",
      feasibility: 0.96,
      triggerOnHighAnswer: true,
    },
    q10: {
      title: "Set a higher-protection air baseline for sensitive households",
      whyItMatters: "Higher-sensitivity contexts often benefit from tighter air and fragrance defaults.",
      minimumStep: "Prioritize fragrance-free defaults in core rooms this week.",
      lowCostUpgrade: "Run purifier support during sleep and high-occupancy periods.",
      premiumUpgrade: "Adopt a full-room protocol for laundry, cleaning, and air flow.",
      feasibility: 0.94,
      triggerOnHighAnswer: false,
    },
  },
  water: {
    q1: {
      title: "Upgrade your drinking water baseline",
      whyItMatters: "Drinking water is a daily pathway, so filter consistency matters.",
      minimumStep: "Pick one primary filtered source and use it as your daily default.",
      lowCostUpgrade: "Keep filtered water prepared to avoid tap fallback during busy days.",
      premiumUpgrade: "Move to a stronger filtration tier when you can maintain it consistently.",
      feasibility: 1.15,
      triggerOnHighAnswer: true,
    },
    q2: {
      title: "Run a local water baseline check",
      whyItMatters: "Knowing local water context helps target practical filter decisions.",
      minimumStep: "Review your utility report and capture a short baseline summary.",
      lowCostUpgrade: "Match your filtration setup to the top concerns from the report.",
      premiumUpgrade: "Set an annual review reminder for local water data.",
      feasibility: 1.2,
      triggerOnHighAnswer: false,
    },
    q3: {
      title: "Reduce routine plastic bottle intake",
      whyItMatters: "Frequent plastic bottle use can become a recurring exposure habit.",
      minimumStep: "Replace daily plastic bottle use with one reusable bottle baseline.",
      lowCostUpgrade: "Create a refill routine before leaving home.",
      premiumUpgrade: "Build a full out-of-home hydration setup for travel and work.",
      feasibility: 1.22,
      triggerOnHighAnswer: true,
    },
    q4: {
      title: "Eliminate heated-plastic drinking patterns",
      whyItMatters: "Heat plus plastic is a high-priority pattern to remove first.",
      minimumStep: "Set a rule to never drink from plastic bottles left in heat.",
      lowCostUpgrade: "Use stainless or glass as your default carry bottle.",
      premiumUpgrade: "Create spare-bottle routines for car, gym, and travel use.",
      feasibility: 1.25,
      triggerOnHighAnswer: true,
    },
    q5: {
      title: "Filter all hot drinks and cooking water",
      whyItMatters: "Cooking and hot beverages contribute meaningful daily water intake.",
      minimumStep: "Use filtered water for hot drinks and cooking for the next 30 days.",
      lowCostUpgrade: "Set up a dedicated kitchen filtered-water station.",
      premiumUpgrade: "Standardize this rule in your weekly kitchen prep routine.",
      feasibility: 1.12,
      triggerOnHighAnswer: false,
    },
    q6: {
      title: "Add a shower filter baseline",
      whyItMatters: "Shower exposure is frequent and can affect skin/hair comfort patterns.",
      minimumStep: "Install a shower filter this week.",
      lowCostUpgrade: "Set cartridge replacement reminders immediately after setup.",
      premiumUpgrade: "Integrate shower filter maintenance into your home calendar.",
      feasibility: 1.04,
      triggerOnHighAnswer: true,
    },
    q7: {
      title: "Address shower-related skin and hair irritation patterns",
      whyItMatters: "Persistent discomfort can signal a water-baseline adjustment opportunity.",
      minimumStep: "Track symptom changes after shower filter and gentle routine updates.",
      lowCostUpgrade: "Use brief cooler-rinse and fragrance-light products while testing.",
      premiumUpgrade: "Run a 30-day water + personal-care reset protocol.",
      feasibility: 0.98,
      triggerOnHighAnswer: true,
    },
    q8: {
      title: "Reduce over-reliance on fridge-filter water",
      whyItMatters: "Fridge filters vary and can be under-maintained in day-to-day use.",
      minimumStep: "Treat fridge water as secondary unless replacement timing is confirmed.",
      lowCostUpgrade: "Use your primary filter source for most drinking water.",
      premiumUpgrade: "Create a maintenance schedule for every active filter point.",
      feasibility: 1.08,
      triggerOnHighAnswer: false,
    },
    q9: {
      title: "Create an out-of-home water strategy",
      whyItMatters: "Consistency often breaks outside home unless defaults are prepared.",
      minimumStep: "Carry a reusable bottle when leaving home this week.",
      lowCostUpgrade: "Set a simple refill rule before errands, work, or travel.",
      premiumUpgrade: "Build a ready travel hydration kit for regular routines.",
      feasibility: 1.2,
      triggerOnHighAnswer: false,
    },
    q10: {
      title: "Use a higher-protection water protocol for sensitive contexts",
      whyItMatters: "Sensitivity-focused households usually benefit from tighter water defaults.",
      minimumStep: "Adopt filtered drinking and no-heated-plastic rules immediately.",
      lowCostUpgrade: "Add filtered cooking and shower filter consistency.",
      premiumUpgrade: "Lock in a stable long-term water maintenance protocol.",
      feasibility: 0.92,
      triggerOnHighAnswer: true,
    },
  },
};

function sanitizePrompt(prompt: string): string {
  const compact = prompt.replace(/\s+/g, " ").trim().replace(/[?.!]+$/, "");
  return compact.length > 84 ? `${compact.slice(0, 81)}...` : compact;
}

function buildFallbackTemplate(quiz: QuizDefinition, question: QuizQuestion): FindingActionTemplate {
  const compactPrompt = sanitizePrompt(question.prompt);

  return {
    title: `Adjust: ${compactPrompt}`,
    whyItMatters: `This answer indicates a repeatable exposure pattern in ${quiz.category}.`,
    minimumStep: "Choose one lower-exposure adjustment for this pattern this week.",
    lowCostUpgrade: "Turn that adjustment into a default routine for the next 30 days.",
    premiumUpgrade: "Upgrade tools or products only after the baseline habit is stable.",
    feasibility: 1.05,
    triggerOnHighAnswer: false,
  };
}

export function getActionTemplate(quiz: QuizDefinition, question: QuizQuestion): FindingActionTemplate {
  const byQuiz = SEEDED_ACTION_TEMPLATES[quiz.id];

  if (byQuiz && byQuiz[question.id]) {
    return byQuiz[question.id];
  }

  return buildFallbackTemplate(quiz, question);
}
