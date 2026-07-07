import { Link } from "@tanstack/react-router";
import ebmLogo from "@/assets/ebm-logo.jpg.asset.json";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center ${className}`}>
      <img
        src={ebmLogo.url}
        alt="EBM"
        className="h-10 w-auto object-contain"
      />
    </Link>
  );
}
