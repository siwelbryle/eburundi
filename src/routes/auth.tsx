import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, ShoppingBag, Store, Building2, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/site/logo";

const authSearchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: authSearchSchema,
  head: () => ({
    meta: [
      { title: "Sign in · EBM" },
      { name: "description", content: "Sign in or create an account on EBM." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

type AccountType = "customer" | "seller" | "store_owner";

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const redirectTo = search.redirect ?? "/dashboard";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: redirectTo });
    });
  }, [navigate, redirectTo]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div
        className="relative hidden flex-col justify-between p-10 text-primary-foreground lg:flex"
        style={{ background: "var(--gradient-hero)" }}
      >
        <Logo className="text-primary-foreground [&_span]:!text-primary-foreground" />
        <div>
          <h1 className="max-w-md font-display text-4xl font-bold leading-tight">
            Welcome to Burundi's marketplace.
          </h1>
          <p className="mt-4 max-w-md text-sm opacity-90">
            Sign in to shop, save your wishlist, track orders, and manage your store — all in one place.
          </p>
          <div className="mt-8 flex gap-1.5">
            <span className="h-1.5 w-16 rounded-full bg-white/70" />
            <span className="h-1.5 w-16 rounded-full bg-white/40" />
            <span className="h-1.5 w-16 rounded-full bg-white/20" />
          </div>
        </div>
        <p className="text-xs opacity-70">© {new Date().getFullYear()} EBM</p>
      </div>

      <div className="flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignInForm redirectTo={redirectTo} />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm redirectTo={redirectTo} />
            </TabsContent>
          </Tabs>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to EBM's{" "}
            <Link to="/" className="underline">Terms</Link> and{" "}
            <Link to="/" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const onClick = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(result.error.message);
      setLoading(false);
      return;
    }
    if (!result.redirected) window.location.href = "/dashboard";
  };
  return (
    <Button variant="outline" className="w-full" onClick={onClick} disabled={loading} type="button">
      {loading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.5-1.7 4.4-5.5 4.4-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.2.8 3.9 1.5l2.7-2.6C17 3.7 14.7 2.7 12 2.7 6.9 2.7 2.8 6.8 2.8 12S6.9 21.3 12 21.3c7 0 9.3-4.9 9.3-8.3 0-.6 0-1.1-.2-1.6H12z" />
        </svg>
      )}
      Continue with Google
    </Button>
  );
}

function SignInForm({ redirectTo }: { redirectTo: string }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
    navigate({ to: redirectTo });
  };

  return (
    <div className="mt-6 space-y-4">
      <GoogleButton />
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">or with email</span>
        </div>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="signin-email">Email</Label>
          <Input id="signin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signin-password">Password</Label>
          <Input id="signin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign in
        </Button>
      </form>
    </div>
  );
}

const ACCOUNT_TYPES: { value: AccountType; icon: typeof ShoppingBag; title: string; desc: string; badge?: string }[] = [
  { value: "customer", icon: ShoppingBag, title: "Shopper", desc: "Buy from local Burundian sellers. Track orders, save wishlists, get exclusive deals." },
  { value: "seller",   icon: Store,      title: "Seller",  desc: "List your products on an existing EBM store. Reach thousands of buyers.", badge: "Admin review" },
  { value: "store_owner", icon: Building2, title: "Store owner", desc: "Open your own branded storefront. Manage inventory, orders, and analytics.", badge: "Admin review" },
];

function SignUpForm({ redirectTo }: { redirectTo: string }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [accountType, setAccountType] = useState<AccountType>("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, requested_role: accountType },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }

    // Fire-and-forget admin notification.
    fetch("/api/notify-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, fullName, requestedRole: accountType }),
    }).catch(() => {});

    if (accountType === "customer") {
      toast.success("Account created — welcome to EBM!");
    } else {
      toast.success("Account created! Your seller access is pending admin review (usually within 48h).");
    }
    navigate({ to: redirectTo });
  };

  return (
    <div className="mt-6 space-y-4">
      {step === 1 ? (
        <>
          <div>
            <p className="text-sm font-semibold">How will you use EBM?</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Pick the option that fits you best. You can request a change later.
            </p>
          </div>
          <div className="space-y-2">
            {ACCOUNT_TYPES.map((opt) => {
              const Icon = opt.icon;
              const active = accountType === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAccountType(opt.value)}
                  className={`grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 rounded-xl border p-3 text-left transition ${
                    active ? "border-primary bg-primary/5 ring-1 ring-primary" : "hover:border-foreground/30"
                  }`}
                >
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${active ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold">{opt.title}</span>
                      {opt.badge && <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">{opt.badge}</span>}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{opt.desc}</span>
                  </span>
                  {active && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </button>
              );
            })}
          </div>
          <Button type="button" className="w-full" onClick={() => setStep(2)}>
            Continue
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>
          <GoogleButton />
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            ← Change account type ({ACCOUNT_TYPES.find((t) => t.value === accountType)?.title})
          </button>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full name</Label>
              <Input id="signup-name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {accountType !== "customer" && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-800 dark:text-amber-300">
                <strong>Admin review:</strong> we notify our team of your {accountType === "seller" ? "seller" : "store owner"} request.
                You'll get a customer account immediately, and your {accountType === "seller" ? "seller" : "store"} access unlocks once approved (usually within 48h).
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create account
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
