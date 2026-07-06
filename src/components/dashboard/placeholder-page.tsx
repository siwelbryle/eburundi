import type { ReactNode } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoles } from "@/hooks/use-roles";
import { navFor, roleLabel } from "@/lib/dashboard-nav";

export function PlaceholderDashboardPage({
  title,
  description,
  breadcrumbs,
  children,
}: {
  title: string;
  description: string;
  breadcrumbs: string[];
  children?: ReactNode;
}) {
  const { primaryRole } = useRoles();
  return (
    <DashboardShell roleLabel={roleLabel(primaryRole)} groups={navFor(primaryRole)} breadcrumbs={breadcrumbs}>
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {children ?? (
          <Card>
            <CardHeader>
              <CardTitle>Coming next</CardTitle>
              <CardDescription>
                This section is scaffolded and connected to the design system. Full CRUD and live data land in the next phase.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              The database schema, RLS policies, and dashboard navigation are already in place. We'll wire this screen to real data next.
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
