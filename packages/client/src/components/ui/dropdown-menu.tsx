import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DropdownMenuProps {
  children: ReactNode;
  trigger: ReactNode;
  align?: "left" | "right";
  open: boolean;
  onToggle: () => void;
}

export function DropdownMenu({ children, trigger, align = "right", open, onToggle }: DropdownMenuProps) {
  return (
    <div className="relative">
      <button onClick={onToggle} className="flex items-center">
        {trigger}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={onToggle} />
          <div
            className={cn(
              "absolute z-50 mt-2 min-w-[180px] rounded-md border border-border bg-card p-1 shadow-lg animate-fade-in",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
}

interface DropdownItemProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function DropdownItem({ children, onClick, className }: DropdownItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}
