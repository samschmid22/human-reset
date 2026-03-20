import { ReactNode } from "react";

import { cn } from "@/lib/cn";

type LayoutProps = {
  children: ReactNode;
  className?: string;
};

export function ScreenContainer({ children, className }: LayoutProps) {
  return <section className={cn("hr-screen-container", className)}>{children}</section>;
}

export function ContentStack({ children, className }: LayoutProps) {
  return <div className={cn("hr-stack", className)}>{children}</div>;
}

export function InlineGroup({ children, className }: LayoutProps) {
  return <div className={cn("hr-inline", className)}>{children}</div>;
}
