import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(4000),
  // Honeypot: legit users leave blank.
  website: z.string().max(0).optional().or(z.literal("")),
});

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!),
  );
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = ContactSchema.safeParse(json);
        if (!parsed.success) {
          return Response.json({ ok: false, error: "Invalid input" }, { status: 400 });
        }
        // Spam honeypot triggered → pretend success.
        if (parsed.data.website) return Response.json({ ok: true });

        const { name, email, message } = parsed.data;
        const { sendGmail, NOTIFY_INBOX } = await import("@/lib/gmail.server");

        const html = `
          <div style="font-family:Arial,sans-serif;max-width:600px">
            <h2 style="color:#CE1126">New EBM contact-form message</h2>
            <p><strong>From:</strong> ${esc(name)} &lt;${esc(email)}&gt;</p>
            <hr/>
            <p style="white-space:pre-wrap">${esc(message)}</p>
            <hr/>
            <p style="color:#888;font-size:12px">Sent from eburundi.lovable.app · Reply directly to respond to the sender.</p>
          </div>`;

        const result = await sendGmail({
          to: NOTIFY_INBOX,
          subject: `[EBM Contact] ${name}`,
          html,
          replyTo: email,
        });

        if (!result.ok) {
          return Response.json({ ok: false, error: "Email service unavailable" }, { status: 502 });
        }
        return Response.json({ ok: true, delivered: !result.skipped });
      },
    },
  },
});
