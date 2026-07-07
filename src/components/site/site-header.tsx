import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, Menu } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Heart, LayoutDashboard, LogOut, Package, Search, ShoppingCart, User } from "lucide-react";
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
import { CATEGORIES } from "@/lib/catalog";
import { useCart, useWishlist } from "@/hooks/use-shop-store";

export function SiteHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const cart = useCart();
  const wish = useWishlist();
  const [q, setQ] = useState("");

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/products", search: { category: "", q, sort: "featured" } });
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-4 px-4">
        <Logo />

        <div className="ml-4 hidden flex-1 md:block">
          <form onSubmit={onSearch} className="flex h-12 items-center overflow-hidden rounded-full border-2 border-primary bg-background pl-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, brands and categories..."
              className="h-full flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
            />
            <Button type="submit" className="h-full rounded-none px-6 font-semibold">Search</Button>
          </form>
        </div>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Button asChild variant="ghost" size="icon" aria-label="Wishlist" className="relative">
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              {wish.count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {wish.count}
                </span>
              )}
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Cart" className="relative">
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cart.count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {cart.count}
                </span>
              )}
            </Link>
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
                <DropdownMenuItem asChild>
                  <Link to="/orders" className="flex items-center gap-2">
                    <Package className="h-4 w-4" /> My orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/wishlist" className="flex items-center gap-2">
                    <Heart className="h-4 w-4" /> Wishlist
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
              <Link to="/auth" search={{ redirect: "" }}>Sign in</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Category strip */}
      <div className="border-t">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4">
          <nav className="flex items-center gap-6 whitespace-nowrap py-3 text-sm font-medium">
            <Link to="/products" search={{ category: "", q: "", sort: "featured" }} className="inline-flex items-center gap-1.5 text-foreground/80 transition hover:text-primary">
              All Products
            </Link>
            <Link to="/products" search={{ category: "", q: "", sort: "featured" }} className="inline-flex items-center gap-1.5 text-primary transition">
              <span>⚡</span> Flash Sales
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                to="/categories/$slug"
                params={{ slug: c.slug }}
                className="inline-flex items-center gap-1.5 text-foreground/80 transition hover:text-primary"
              >
                <span>{c.emoji}</span>
                <span>{c.name}</span>
              </Link>
            ))}
            <Link to="/stores" className="ml-auto inline-flex items-center gap-1.5 text-foreground/80 transition hover:text-primary">
              Sellers
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
