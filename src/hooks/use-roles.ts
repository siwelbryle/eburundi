import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./use-auth";

export type AppRole = "super_admin" | "admin" | "store_owner" | "seller" | "customer";

export function useRoles() {
  const { user, loading } = useAuth();
  const query = useQuery({
    queryKey: ["user-roles", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<AppRole[]> => {
      const { data, error } = await supabase
        .from("user_roles" as never)
        .select("role")
        .eq("user_id" as never, user!.id as never);
      if (error) throw error;
      return (data as { role: AppRole }[]).map((r) => r.role);
    },
  });

  const roles = query.data ?? [];
  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  const isSuperAdmin = roles.includes("super_admin");
  const isStoreOwner = roles.includes("store_owner");
  const isSeller = roles.includes("seller") || isStoreOwner;
  const isCustomer = roles.includes("customer");

  return {
    roles,
    isAdmin,
    isSuperAdmin,
    isStoreOwner,
    isSeller,
    isCustomer,
    loading: loading || query.isLoading,
    primaryRole: (roles.includes("super_admin")
      ? "super_admin"
      : roles.includes("admin")
        ? "admin"
        : roles.includes("store_owner")
          ? "store_owner"
          : roles.includes("seller")
            ? "seller"
            : "customer") as AppRole,
  };
}
