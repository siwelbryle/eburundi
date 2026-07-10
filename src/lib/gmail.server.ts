// Gmail sending via the Lovable connector gateway.
// Silently no-ops when the Gmail connector is not linked so the app keeps working.

const GATEWAY = "https://connector-gateway.lovable.dev/google_mail/gmail/v1";

function base64UrlEncode(input: string) {
  return Buffer.from(input, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function buildRfc2822({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const lines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    ...(replyTo ? [`Reply-To: ${replyTo}`] : []),
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
  ];
  return lines.join("\r\n");
}

export async function sendGmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const gmailKey = process.env.GOOGLE_MAIL_API_KEY;
  if (!lovableKey || !gmailKey) {
    console.warn("[gmail] Skipping send — Gmail connector not linked yet.");
    return { ok: true, skipped: true };
  }
  try {
    const raw = base64UrlEncode(buildRfc2822(opts));
    const res = await fetch(`${GATEWAY}/users/me/messages/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": gmailKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`[gmail] send failed ${res.status}: ${body}`);
      return { ok: false, error: `${res.status}: ${body}` };
    }
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[gmail] send exception:", msg);
    return { ok: false, error: msg };
  }
}

export const NOTIFY_INBOX = "siwelbryl@gmail.com";
