import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 font-display font-extrabold ${className}`}>
      <span
        aria-hidden
        className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground text-lg shadow-elegant"
      >
        K
      </span>
      <span className="text-2xl tracking-tight leading-none">
        <span className="text-foreground">Karama</span>
        <span className="text-success">Market</span>
      </span>
    </Link>
  );
}
