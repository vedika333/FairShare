import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

// Reusable focal card surface with thin ink border and hard offset shadow
export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`focal-card p-5 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}
