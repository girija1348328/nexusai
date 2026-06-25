import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Search, Menu, X, LogOut, PenSquare, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">NexusAI</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {["AI", "Development", "Startup", "Defense & Drones"].map((cat) => (
            <Link
              key={cat}
              to={`/?category=${cat.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {cat}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {onSearch && (
            <>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="rounded-md p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
              {searchOpen && (
                <form onSubmit={handleSearch} className="animate-fade-in">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search articles..."
                    className="h-8 w-48 rounded-md border border-border bg-card px-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    autoFocus
                  />
                </form>
              )}
            </>
          )}

          <button
            onClick={toggleTheme}
            className="rounded-md p-2 text-muted-foreground hover:text-foreground transition-colors"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/articles/new")}
              >
                <PenSquare className="mr-1.5 h-3.5 w-3.5" />
                Write
              </Button>
              <Link
                to="/admin"
                className="hidden text-sm text-muted-foreground hover:text-foreground sm:block"
              >
                {user?.name}
              </Link>
              <Button variant="ghost" size="icon" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/login")}>
              Login
            </Button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-md p-2 text-muted-foreground hover:text-foreground transition-colors md:hidden"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border px-4 py-3 animate-fade-in md:hidden">
          {["AI", "Development", "Startup", "Defense & Drones"].map((cat) => (
            <Link
              key={cat}
              to={`/?category=${cat.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`}
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {cat}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
