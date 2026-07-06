import { Link } from "@tanstack/react-router";
import { Heart, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fmtFbu, type Product } from "@/lib/catalog";
import { useCart, useWishlist } from "@/hooks/use-shop-store";
import { toast } from "sonner";

export function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-500">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < Math.round(value) ? "fill-current" : "opacity-30"}`}
        />
      ))}
    </div>
  );
}

export function ProductCard({ p }: { p: Product }) {
  const cart = useCart();
  const wish = useWishlist();
  const wished = wish.has(p.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card shadow-card transition hover:-translate-y-0.5 hover:shadow-elegant">
      <Link
        to="/products/$id"
        params={{ id: p.id }}
        className="relative aspect-square overflow-hidden bg-muted"
      >
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {p.flash && (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
              <Zap className="h-3 w-3" /> Flash
            </span>
          )}
          {p.discount && (
            <span className="inline-flex items-center rounded-md bg-success px-2 py-0.5 text-[10px] font-bold text-success-foreground">
              -{p.discount}%
            </span>
          )}
        </div>
      </Link>
      <button
        aria-label="Wishlist"
        onClick={() => {
          wish.toggle(p.id);
          toast.success(wished ? "Removed from wishlist" : "Added to wishlist");
        }}
        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 text-foreground shadow-card transition hover:bg-background"
      >
        <Heart className={`h-4 w-4 ${wished ? "fill-primary text-primary" : ""}`} />
      </button>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link
          to="/stores/$slug"
          params={{ slug: p.sellerSlug }}
          className="text-[11px] font-bold uppercase tracking-wider text-primary hover:underline"
        >
          {p.seller}
        </Link>
        <Link to="/products/$id" params={{ id: p.id }} className="line-clamp-1 text-sm font-semibold hover:text-primary">
          {p.title}
        </Link>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Stars value={p.rating} />
          <span>({p.reviews})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-primary">{fmtFbu(p.price)}</span>
          {p.compareAt && (
            <span className="text-xs text-muted-foreground line-through">{fmtFbu(p.compareAt)}</span>
          )}
        </div>
        <Button
          size="sm"
          onClick={() => {
            cart.add(p.id);
            toast.success("Added to cart");
          }}
          className="mt-1 w-full bg-success text-success-foreground hover:bg-success/90"
        >
          Add to cart
        </Button>
      </div>
    </div>
  );
}
