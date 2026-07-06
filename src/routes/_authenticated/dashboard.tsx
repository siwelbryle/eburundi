import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  Box,
  Heart,
  LayoutDashboard,
  MapPin,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Star,
  Store,
  Tag,
  Ticket,
  Users,
} from "lucide-react";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import { useAuth } from "@/hooks/use-auth";
import { useRoles, type AppRole } from "@/hooks/use-roles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · eBurundi Market" }, { name: "robots", content: "noindex" }] }),
  component: DashboardPage,
});

const ROLE_LABEL: Record<AppRole, string> = {
  super_admin: "Super admin",
  admin: "Administrator",
  store_owner: "Store owner",
  seller: "Seller",
  customer: "Customer",
};

const CUSTOMER_NAV: DashboardNavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "My orders", url: "/dashboard", icon: ShoppingBag },
  { title: "Wishlist", url: "/dashboard", icon: Heart },
  { title: "Addresses", url: "/dashboard", icon: MapPin },
  { title: "Reviews", url: "/dashboard", icon: Star },
  { title: "Settings", url: "/dashboard", icon: Settings },
];

const SELLER_NAV: DashboardNavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "My store", url: "/dashboard", icon: Store },
  { title: "Products", url: "/dashboard", icon: Box },
  { title: "Orders", url: "/dashboard", icon: Package },
  { title: "Analytics", url: "/dashboard", icon: BarChart3 },
  { title: "Settings", url: "/dashboard", icon: Settings },
];

const ADMIN_NAV: DashboardNavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/dashboard", icon: Users },
  { title: "Stores", url: "/dashboard", icon: Store },
  { title: "Products", url: "/dashboard", icon: Box },
  { title: "Orders", url: "/dashboard", icon: Package },
  { title: "Categories", url: "/dashboard", icon: Tag },
  { title: "Coupons", url: "/dashboard", icon: Ticket },
  { title: "Banners", url: "/dashboard", icon: BarChart3 },
  { title: "Roles & permissions", url: "/dashboard", icon: ShieldCheck },
  { title: "Settings", url: "/dashboard", icon: Settings },
];

function navFor(role: AppRole) {
  if (role === "super_admin" || role === "admin") {
    return [{ label: "Administration", items: ADMIN_NAV }];
  }
  if (role === "store_owner" || role === "seller") {
    return [{ label: "My business", items: SELLER_NAV }];
  }
  return [{ label: "My account", items: CUSTOMER_NAV }];
}

function DashboardPage() {
  const { user } = useAuth();
  const { primaryRole, loading } = useRoles();

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const groups = navFor(primaryRole);
  const label = ROLE_LABEL[primaryRole];

  return (
    <DashboardShell
      roleLabel={label}
      groups={groups}
      breadcrumbs={["Dashboard", "Overview"]}
    >
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back 👋</h1>
          <p className="text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium text-foreground">{user?.email}</span> · Role:{" "}
            <span className="font-medium text-primary">{label}</span>
          </p>
        </div>

        <RoleOverview role={primaryRole} />

        <Card>
          <CardHeader>
            <CardTitle>Foundation ready ✅</CardTitle>
            <CardDescription>
              Design system, database schema, authentication, and role-based access are in place.
              Next: product catalog, storefront, cart & checkout, seller onboarding, and admin CRUD.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </DashboardShell>
  );
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      {hint && <CardContent className="pt-0 text-xs text-muted-foreground">{hint}</CardContent>}
    </Card>
  );
}

function RoleOverview({ role }: { role: AppRole }) {
  if (role === "super_admin" || role === "admin") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value="—" hint="Grows with sign-ups" />
        <StatCard label="Active stores" value="—" />
        <StatCard label="Published products" value="—" />
        <StatCard label="Orders today" value="—" />
      </div>
    );
  }
  if (role === "store_owner" || role === "seller") {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value="0" hint="Create your first listing" />
        <StatCard label="Orders" value="0" />
        <StatCard label="Revenue" value="0 BIF" />
        <StatCard label="Store rating" value="—" />
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Orders" value="0" />
      <StatCard label="Wishlist" value="0" />
      <StatCard label="Addresses" value="0" />
      <StatCard label="Reviews" value="0" />
    </div>
  );
}
