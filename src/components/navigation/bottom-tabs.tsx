"use client";

import { useEffect, useRef, useState } from "react";

import { TabIcon } from "@/components/icons/tab-icons";
import { TabId, TABS } from "@/features/phase-one/tabs";
import { cn } from "@/lib/cn";

type BottomTabsProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
};

export function BottomTabs({ activeTab, onTabChange }: BottomTabsProps) {
  const tabRefs = useRef<Map<TabId, HTMLButtonElement | null>>(new Map());
  const listRef = useRef<HTMLUListElement | null>(null);
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const activeEl = tabRefs.current.get(activeTab);
    const listEl = listRef.current;
    if (!activeEl || !listEl) return;

    const listRect = listEl.getBoundingClientRect();
    const tabRect = activeEl.getBoundingClientRect();
    setPillStyle({
      left: tabRect.left - listRect.left,
      width: tabRect.width,
    });
  }, [activeTab]);

  return (
    <nav aria-label="Primary" className="hr-tabs">
      <p className="hr-tabs-heading">Navigation</p>
      <ul className="hr-tab-list" ref={listRef}>
        {pillStyle ? (
          <div
            aria-hidden="true"
            className="hr-tab-pill"
            style={{ left: pillStyle.left, width: pillStyle.width }}
          />
        ) : null}
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <li className="hr-tab-item" key={tab.id}>
              <button
                aria-current={isActive ? "page" : undefined}
                aria-label={tab.label}
                className={cn("hr-tab-button", isActive && "is-active")}
                onClick={() => onTabChange(tab.id)}
                ref={(el) => { tabRefs.current.set(tab.id, el); }}
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
