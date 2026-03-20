"use client";

import { TabIcon } from "@/components/icons/tab-icons";
import { TabId, TABS } from "@/features/phase-one/tabs";
import { cn } from "@/lib/cn";

type BottomTabsProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

export function BottomTabs({ activeTab, onTabChange }: BottomTabsProps) {
  return (
    <nav aria-label="Primary" className="hr-tabs">
      <p className="hr-tabs-heading">Navigation</p>
      <ul className="hr-tab-list">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <li className="hr-tab-item" key={tab.id}>
              <button
                aria-current={isActive ? "page" : undefined}
                aria-label={tab.label}
                className={cn("hr-tab-button", isActive && "is-active")}
                onClick={() => onTabChange(tab.id)}
                type="button"
              >
                <TabIcon tab={tab.id} />
                <span className="hr-tab-label">{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
