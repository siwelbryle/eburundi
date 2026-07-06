import { Link } from "@tanstack/react-router";
import { LayoutDashboard, LogOut, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CATEGORY_STRIP = [
  { label: "All Products", emoji: "" },
  { label: "Flash Sales", emoji: "⚡", accent: true },
  { label: "Automotive", emoji: "🚗" },
  { label: "Baby Products", emoji: "🍼" },
  { label: "Beauty & Health", emoji: "💄" },
  { label: "Books", emoji: "📚" },
  { label: "Computers", emoji: "💻" },
  { label: "Electronics", emoji: "📱" },
  { label: "Fashion", emoji: "👗" },
  { label: "Furniture", emoji: "🛋️" },
  { label: "Garden", emoji: "🌱" },
  { label: "Groceries", emoji: "🛒" },
];

export function SiteHeader() {
  const { user } = useAuth();

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4">
        <Logo />

        <div className="ml-4 hidden flex-1 md:block">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex h-12 items-center overflow-hidden rounded-full border-2 border-primary bg-background pl-4"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products, brands and categories..."
              className="h-full flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button type="submit" className="h-full rounded-none px-6 font-semibold">
              Search
            </Button>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Button variant="ghost" size="icon" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="ml-1 rounded-full px-6 font-semibold">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Category strip */}
      <div className="border-t">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4">
          <nav className="flex items-center gap-6 whitespace-nowrap py-3 text-sm font-medium">
            {CATEGORY_STRIP.map((c) => (
              <button
                key={c.label}
                className={`inline-flex items-center gap-1.5 transition hover:text-primary ${
                  c.accent ? "text-primary" : "text-foreground/80"
                }`}
              >
                {c.emoji && <span>{c.emoji}</span>}
                <span>{c.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
