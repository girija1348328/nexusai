import { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

export function Layout({ children, onSearch }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={onSearch} />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground/50">
        NexusAI — AI meets TechCrunch
      </footer>
    </div>
  );
}
