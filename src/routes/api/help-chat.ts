// Help Center AI assistant — calls Lovable AI Gateway directly (no AI SDK dependency).
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});
const RequestSchema = z.object({
  language: z.enum(["en", "fr", "rn"]).default("en"),
  messages: z.array(MessageSchema).min(1).max(20),
});

const SYSTEM = {
  en: `You are the EBM Support Assistant for eBurundi Market — Burundi's trusted multi-vendor marketplace.
You help customers, sellers, and store owners with questions about:
- Ordering, payments (Lumicash, mobile money, cash on delivery, bank cards)
- Delivery (1–3 days in Bujumbura, 2–5 days elsewhere in Burundi)
- Returns (30-day return policy)
- Becoming a seller (create an account, choose "Seller" or "Store owner" — admin reviews within 48h)
- Product listings, catalogue, prices in FBu
Contact: eburundimarket@gmail.com · siwelbryl@gmail.com · +257 69 393 285
Keep answers short, warm and professional. If you don't know, tell the user to contact support.
Always reply in ENGLISH.`,
  fr: `Vous êtes l'assistant support d'EBM — eBurundi Market, la marketplace multi-vendeurs de confiance au Burundi.
Vous aidez les clients, vendeurs et propriétaires de boutique sur :
- Commandes, paiements (Lumicash, mobile money, paiement à la livraison, cartes bancaires)
- Livraison (1 à 3 jours à Bujumbura, 2 à 5 jours ailleurs au Burundi)
- Retours (politique de retour de 30 jours)
- Devenir vendeur (créer un compte, choisir "Vendeur" ou "Propriétaire de boutique" — l'admin examine sous 48h)
- Catalogue et prix en FBu
Contact : eburundimarket@gmail.com · siwelbryl@gmail.com · +257 69 393 285
Réponses courtes, chaleureuses et professionnelles. Si vous ne savez pas, dirigez vers le support.
Répondez toujours en FRANÇAIS.`,
  rn: `Uri umufasha wa EBM — eBurundi Market, isoko ry'abagurisha benshi ryizewe mu Burundi.
Ufasha abakiliya, abagurisha n'abanyeshuri ku bibazo bijanye n'ibi:
- Gutumiza, kwishura (Lumicash, mobile money, kwishura ku gihe cyo gutanga, ikarita za banki)
- Gutwara (iminsi 1–3 i Bujumbura, iminsi 2–5 mu bindi bice by'Uburundi)
- Gusubiza (politiki y'iminsi 30)
- Kuba umugurisha (fungura konte, hitamo "Umugurisha" cyangwa "Nyir'iduka" — umuyobozi arasuzuma mu masaha 48)
- Katarogi n'ibiciro muri FBu
Kuvugana: eburundimarket@gmail.com · siwelbryl@gmail.com · +257 69 393 285
Subiza make, mu buryo bwiza n'ubunyamwuga. Iyo utabizi, sengera umuntu ku bafasha.
Subiza mu KIRUNDI iteka.`,
};

export const Route = createFileRoute("/api/help-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return Response.json({ ok: false, error: "AI service not configured" }, { status: 500 });
        }

        let json: unknown;
        try { json = await request.json(); } catch {
          return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = RequestSchema.safeParse(json);
        if (!parsed.success) {
          return Response.json({ ok: false, error: "Invalid input" }, { status: 400 });
        }
        const { language, messages } = parsed.data;

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Lovable-API-Key": key,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: SYSTEM[language] },
              ...messages,
            ],
          }),
        });

        if (res.status === 429) {
          return Response.json({ ok: false, error: "Rate limited — please try again in a moment." }, { status: 429 });
        }
        if (res.status === 402) {
          return Response.json({ ok: false, error: "AI credits exhausted. Please contact support." }, { status: 402 });
        }
        if (!res.ok) {
          const body = await res.text();
          console.error("[help-chat] gateway error", res.status, body);
          return Response.json({ ok: false, error: "AI service error" }, { status: 502 });
        }
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const reply = data.choices?.[0]?.message?.content?.trim() ?? "";
        return Response.json({ ok: true, reply });
      },
    },
  },
});
