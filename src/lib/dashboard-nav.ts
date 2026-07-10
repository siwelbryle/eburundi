import {
  BarChart3, Box, Heart, LayoutDashboard, MapPin, Package, Settings,
  ShieldCheck, ShoppingBag, Star, Store, Tag, Ticket, UserCheck, Users,
} from "lucide-react";
import type { DashboardNavItem } from "@/components/dashboard/dashboard-shell";
import type { AppRole } from "@/hooks/use-roles";

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Super admin",
  admin: "Administrator",
  store_owner: "Store owner",
  seller: "Seller",
  customer: "Customer",
};

export const CUSTOMER_NAV: DashboardNavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "My orders", url: "/orders", icon: ShoppingBag },
  { title: "Wishlist", url: "/wishlist", icon: Heart },
  { title: "Addresses", url: "/addresses", icon: MapPin },
  { title: "Reviews", url: "/dashboard", icon: Star },
  { title: "Settings", url: "/account", icon: Settings },
];

export const SELLER_NAV: DashboardNavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "My store", url: "/seller/store", icon: Store },
  { title: "Products", url: "/seller/products", icon: Box },
  { title: "Orders", url: "/seller/orders", icon: Package },
  { title: "Analytics", url: "/seller/analytics", icon: BarChart3 },
  { title: "Settings", url: "/account", icon: Settings },
];

export const ADMIN_NAV: DashboardNavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Stores", url: "/admin/stores", icon: Store },
  { title: "Products", url: "/admin/products", icon: Box },
  { title: "Orders", url: "/admin/orders", icon: Package },
  { title: "Categories", url: "/admin/categories", icon: Tag },
  { title: "Coupons", url: "/admin/coupons", icon: Ticket },
  { title: "Banners", url: "/admin/banners", icon: BarChart3 },
  { title: "Roles & permissions", url: "/admin/roles", icon: ShieldCheck },
  { title: "Role requests", url: "/admin/role-requests", icon: UserCheck },
  { title: "Settings", url: "/account", icon: Settings },
];

export function navFor(role: AppRole) {
  if (role === "super_admin" || role === "admin") return [{ label: "Administration", items: ADMIN_NAV }];
  if (role === "store_owner" || role === "seller") return [{ label: "My business", items: SELLER_NAV }];
  return [{ label: "My account", items: CUSTOMER_NAV }];
}

export function roleLabel(role: AppRole) {
  return ROLE_LABELS[role];
}
