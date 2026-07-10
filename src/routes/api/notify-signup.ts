// Public endpoint called right after a signup to notify admins.
// Non-blocking on the client side — if this fails, signup still succeeds.
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const Schema = z.object({
  email: z.string().trim().email().max(255),
  fullName: z.string().trim().max(200).optional(),
  requestedRole: z.enum(["customer", "seller", "store_owner"]),
});

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );
}

export const Route = createFileRoute("/api/notify-signup")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json({ ok: false }, { status: 400 });
        }
        const parsed = Schema.safeParse(json);
        if (!parsed.success) return Response.json({ ok: false }, { status: 400 });

        const { email, fullName, requestedRole } = parsed.data;
        const { sendGmail, NOTIFY_INBOX } = await import("@/lib/gmail.server");

        const roleLabel =
          requestedRole === "seller" ? "Seller"
          : requestedRole === "store_owner" ? "Store Owner"
          : "Customer";

        const needsReview = requestedRole !== "customer";
        const subject = needsReview
          ? `[EBM] New ${roleLabel} request — ${email}`
          : `[EBM] New customer signup — ${email}`;

        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px">
            <h2 style="color:#CE1126">${needsReview ? "New seller / store owner request" : "New customer signup"}</h2>
            <p><strong>Name:</strong> ${esc(fullName ?? "—")}</p>
            <p><strong>Email:</strong> ${esc(email)}</p>
            <p><strong>Requested role:</strong> ${esc(roleLabel)}</p>
            ${needsReview ? `<p style="background:#fff7e6;border-left:3px solid #f59e0b;padding:8px 12px">
              This user is waiting for admin approval. Review at <a href="https://eburundi.lovable.app/admin/role-requests">admin/role-requests</a>.
              If access should be denied, contact them at ${esc(email)}.
            </p>` : ""}
          </div>`;

        await sendGmail({ to: NOTIFY_INBOX, subject, html, replyTo: email });
        return Response.json({ ok: true });
      },
    },
  },
});
