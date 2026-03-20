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
          <path d="M4.5 18c3.5-8 11.5-8 15-1" />
          <path d="M6 15.5c3.5-5.8 8.9-5.5 12-.8" />
          <circle cx="7" cy="14.5" r="1.2" />
          <circle cx="13" cy="11.2" r="1.2" />
          <circle cx="18" cy="14.2" r="1.2" />
        </IconFrame>
      );

    case "vault":
      return (
        <IconFrame>
          <path d="M5 10.5 12 4l7 6.5V19a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
          <rect height="7" rx="1" width="6" x="9" y="13" />
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
