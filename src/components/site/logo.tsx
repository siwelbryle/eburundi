import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 font-display font-bold ${className}`}>
      <span
        aria-hidden
        className="grid h-9 w-9 place-items-center rounded-lg text-primary-foreground shadow-elegant"
        style={{ background: "var(--gradient-primary)" }}
      >
        <span className="text-lg">S</span>
      </span>
      <span className="text-xl tracking-tight">
        Soko<span className="text-primary">Burundi</span>
      </span>
    </Link>
  );
}
