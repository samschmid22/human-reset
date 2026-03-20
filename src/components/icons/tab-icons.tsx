import type { ReactNode } from "react";

import type { TabId } from "@/features/phase-one/tabs";

type TabIconProps = {
  tab: TabId;
};

function IconFrame({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      className="hr-tab-icon"
      fill="none"
      height="20"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width="20"
    >
      {children}
    </svg>
  );
}

export function TabIcon({ tab }: TabIconProps) {
  switch (tab) {
    case "home":
      return (
        <IconFrame>
          <path d="M3.5 10.5 12 4l8.5 6.5" />
          <path d="M5.5 9.8V20h13V9.8" />
          <path d="M9.5 20v-5h5V20" />
        </IconFrame>
      );

    case "quizzes":
      return (
        <IconFrame>
          <rect height="15" rx="2" width="13" x="5.5" y="4.5" />
          <path d="M9 9h6" />
          <path d="M9 12.5h4" />
          <path d="M9 16h5" />
          <path d="m7.25 9.25.5.5.9-.9" />
        </IconFrame>
      );

    case "roadmap":
      return (
        <IconFrame>
          <path d="M5 20V6.5" />
          <path d="M5 7h14l-2.8 3.6L19 14H5" />
          <circle cx="5" cy="19" r="1.4" />
        </IconFrame>
      );

    case "vault":
      return (
        <IconFrame>
          <path d="M5 6.6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11.2a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
          <path d="M9 4.6v15" />
          <path d="M12 8h4.5" />
          <path d="M12 11h3.5" />
          <path d="M12 14h4" />
        </IconFrame>
      );

    case "profile":
      return (
        <IconFrame>
          <circle cx="12" cy="8" r="3.1" />
          <path d="M5.2 19.5c1.5-2.9 4-4.2 6.8-4.2s5.3 1.3 6.8 4.2" />
        </IconFrame>
      );

    default:
      return null;
  }
}
