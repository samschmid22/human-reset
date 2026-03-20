"use client";

import { useMemo, useState } from "react";

import { BottomTabs } from "@/components/navigation/bottom-tabs";
import { HomeScreen } from "@/features/phase-one/screens/home-screen";
import { ProfileScreen } from "@/features/phase-one/screens/profile-screen";
import { QuizzesScreen } from "@/features/phase-one/screens/quizzes-screen";
import { RoadmapScreen } from "@/features/phase-one/screens/roadmap-screen";
import { VaultScreen } from "@/features/phase-one/screens/vault-screen";
import { TabId } from "@/features/phase-one/tabs";

const searchableTabs: TabId[] = ["home", "roadmap", "vault"];

export function PhaseOneAppShell() {
  const [activeTab, setActiveTab] = useState<TabId>("home");

  const ActiveScreen = useMemo(() => {
    switch (activeTab) {
      case "home":
        return HomeScreen;
      case "quizzes":
        return QuizzesScreen;
      case "roadmap":
        return RoadmapScreen;
      case "vault":
        return VaultScreen;
      case "profile":
        return ProfileScreen;
      default:
        return HomeScreen;
    }
  }, [activeTab]);

  const searchEnabled = searchableTabs.includes(activeTab);

  return (
    <div className="hr-app-root">
      <main aria-label="The Human Reset" className="hr-shell" role="application">
        <header className="hr-shell-header">
          <button aria-label="Open menu" className="hr-icon-button" type="button">
            <svg aria-hidden="true" className="hr-shell-icon" fill="none" viewBox="0 0 24 24">
              <path d="M5 7h14" />
              <path d="M5 12h14" />
              <path d="M5 17h10" />
            </svg>
          </button>

          <div className="hr-shell-title-wrap">
            <p className="hr-shell-eyebrow">Guided Environmental Reset</p>
            <h1 className="hr-shell-title">The Human Reset</h1>
          </div>

          <button
            aria-disabled={!searchEnabled}
            aria-label={searchEnabled ? "Search" : "Search unavailable on this tab"}
            className="hr-icon-button"
            disabled={!searchEnabled}
            type="button"
          >
            <svg aria-hidden="true" className="hr-shell-icon" fill="none" viewBox="0 0 24 24">
              <circle cx="10" cy="10" r="5" />
              <path d="m14 14 5 5" />
            </svg>
          </button>
        </header>

        <div className="hr-shell-body">
          <ActiveScreen />
        </div>

        <BottomTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </main>
    </div>
  );
}
