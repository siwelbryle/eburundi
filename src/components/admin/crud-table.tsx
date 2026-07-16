import { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "datetime";

export type Field = {
  key: string;
  label: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  hint?: string;
  hiddenOnCreate?: boolean;
};

export type Column<Row> = {
  key: string;
  label: string;
  render?: (row: Row) => React.ReactNode;
};

type Row = Record<string, unknown> & { id?: string };

type Props<R extends Row> = {
  title: string;
  table: string;
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  columns: Column<R>[];
  fields: Field[];
  searchColumn?: string;
  canCreate?: boolean;
  canDelete?: boolean;
  defaultRow?: Partial<R>;
  transformIn?: (row: R) => R;
  transformOut?: (row: Partial<R>) => Record<string, unknown>;
  extraActions?: (row: R, refresh: () => void) => React.ReactNode;
};

export function CrudTable<R extends Row>({
  title, table, select = "*", orderBy = { column: "created_at", ascending: false },
  columns, fields, searchColumn, canCreate = true, canDelete = true,
  defaultRow, transformIn, transformOut, extraActions,
}: Props<R>) {
  const [rows, setRows] = useState<R[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Partial<R> | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<R | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const query = supabase.from(table as never).select(select).order(orderBy.column, { ascending: orderBy.ascending ?? false }).limit(500);
    const { data, error } = await query;
    setLoading(false);
    if (error) {
      toast.error(`Failed to load ${title}: ${error.message}`);
      return;
    }
    setRows(((data as unknown as R[]) ?? []).map((r) => (transformIn ? transformIn(r) : r)));
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [table]);

  const filtered = useMemo(() => {
    if (!q || !searchColumn) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r) => String(r[searchColumn] ?? "").toLowerCase().includes(needle));
  }, [rows, q, searchColumn]);

  const openCreate = () => { setEditing({ ...(defaultRow as Partial<R>) } as Partial<R>); setCreating(true); };
  const openEdit = (r: R) => { setEditing({ ...r } as Partial<R>); setCreating(false); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = transformOut ? transformOut(editing) : editing;
    let error;
    if (creating || !editing.id) {
      const insertPayload = { ...payload };
      delete (insertPayload as Record<string, unknown>).id;
      ({ error } = await supabase.from(table as never).insert(insertPayload as never));
    } else {
      ({ error } = await supabase.from(table as never).update(payload as never).eq("id" as never, editing.id as never));
    }
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(creating ? "Created" : "Updated");
    setEditing(null);
    load();
  };

  const remove = async () => {
    if (!deleting?.id) return;
    const { error } = await supabase.from(table as never).delete().eq("id" as never, deleting.id as never);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted");
    setDeleting(null);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? "record" : "records"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {searchColumn && (
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="w-56 pl-8" />
            </div>
          )}
          <Button variant="outline" size="icon" onClick={load} aria-label="Refresh"><RefreshCw className="h-4 w-4" /></Button>
          {canCreate && <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> New</Button>}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              {columns.map((c) => (<th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>))}
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={columns.length + 1} className="px-4 py-16 text-center"><Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={columns.length + 1} className="px-4 py-16 text-center text-muted-foreground">No records yet.</td></tr>
            ) : filtered.map((r) => (
              <tr key={String(r.id)} className="border-t hover:bg-muted/30">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 align-middle">
                    {c.render ? c.render(r) : String(r[c.key] ?? "—")}
                  </td>
                ))}
                <td className="px-4 py-3 text-right align-middle">
                  <div className="flex items-center justify-end gap-1">
                    {extraActions?.(r, load)}
                    <Button variant="ghost" size="icon" onClick={() => openEdit(r)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
                    {canDelete && <Button variant="ghost" size="icon" onClick={() => setDeleting(r)} aria-label="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader><DialogTitle>{creating ? `New ${title.replace(/s$/, "")}` : `Edit ${title.replace(/s$/, "")}`}</DialogTitle></DialogHeader>
          {editing && (
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.filter((f) => !(creating && f.hiddenOnCreate)).map((f) => (
                <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                  <Label htmlFor={f.key}>{f.label}{f.required && <span className="text-destructive">*</span>}</Label>
                  {f.type === "textarea" ? (
                    <Textarea id={f.key} value={String(editing[f.key] ?? "")} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} rows={3} placeholder={f.placeholder} />
                  ) : f.type === "select" ? (
                    <Select value={String(editing[f.key] ?? "")} onValueChange={(v) => setEditing({ ...editing, [f.key]: v })}>
                      <SelectTrigger id={f.key}><SelectValue placeholder={f.placeholder || "Select…"} /></SelectTrigger>
                      <SelectContent>{f.options?.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                    </Select>
                  ) : f.type === "boolean" ? (
                    <div className="flex h-10 items-center gap-2">
                      <input id={f.key} type="checkbox" checked={!!editing[f.key]} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.checked })} className="h-4 w-4" />
                      <span className="text-sm text-muted-foreground">{f.hint || "Enabled"}</span>
                    </div>
                  ) : f.type === "number" ? (
                    <Input id={f.key} type="number" step="any" value={String(editing[f.key] ?? "")} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value === "" ? null : Number(e.target.value) })} placeholder={f.placeholder} />
                  ) : f.type === "datetime" ? (
                    <Input id={f.key} type="datetime-local" value={editing[f.key] ? String(editing[f.key]).slice(0, 16) : ""} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value ? new Date(e.target.value).toISOString() : null })} />
                  ) : (
                    <Input id={f.key} value={String(editing[f.key] ?? "")} onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })} placeholder={f.placeholder} />
                  )}
                  {f.hint && f.type !== "boolean" && <p className="mt-1 text-xs text-muted-foreground">{f.hint}</p>}
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete record?</AlertDialogTitle>
            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
