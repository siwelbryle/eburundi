import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type FormEvent } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help Center · EBM" },
      { name: "description", content: "Multilingual help center with a smart AI assistant — answers about orders, delivery, returns, and selling on EBM." },
    ],
  }),
  component: HelpPage,
});

type Lang = "en" | "fr" | "rn";

const T: Record<Lang, {
  title: string;
  subtitle: string;
  sections: { heading: string; items: { q: string; a: string }[] }[];
  chatTitle: string;
  chatIntro: string;
  placeholder: string;
  send: string;
  error: string;
  suggested: string[];
}> = {
  en: {
    title: "Help Center",
    subtitle: "Answers to the questions we get most often. Ask our AI assistant for anything else.",
    chatTitle: "EBM AI Assistant",
    chatIntro: "Hi 👋 I'm EBM's assistant. Ask me about orders, delivery, returns, payments, or becoming a seller.",
    placeholder: "Ask a question…",
    send: "Send",
    error: "Sorry, I couldn't reach the assistant. Please try again.",
    suggested: ["How long does delivery take?", "How do I become a seller?", "What payment methods do you accept?"],
    sections: [
      { heading: "Ordering", items: [
        { q: "How do I place an order?", a: "Add products to your cart, go to checkout, choose a delivery address and payment method, and confirm." },
        { q: "Can I order without an account?", a: "You can browse freely, but an account is required to checkout so we can track and deliver your order." },
      ]},
      { heading: "Delivery", items: [
        { q: "How long does delivery take?", a: "Typically 1–3 days in Bujumbura and 2–5 days elsewhere in Burundi." },
        { q: "Do you deliver to my province?", a: "We deliver across all 18 provinces of Burundi. Shipping fees vary by distance." },
      ]},
      { heading: "Payments", items: [
        { q: "Which payment methods do you accept?", a: "Lumicash, mobile money, cash on delivery, and bank cards (rolling out)." },
        { q: "Is my payment secure?", a: "Yes. Card payments are handled by certified providers — we never see your card details." },
      ]},
      { heading: "Selling", items: [
        { q: "How do I become a seller?", a: "Create an account, choose \"Seller\" or \"Store owner\" at signup. Our admins review your request within 48h." },
        { q: "What fees do sellers pay?", a: "A small commission per sale. No monthly fee, no upfront cost." },
      ]},
      { heading: "Returns", items: [
        { q: "What is your return policy?", a: "30-day returns for most products in their original condition. Custom-made items are final sale." },
      ]},
    ],
  },
  fr: {
    title: "Centre d'aide",
    subtitle: "Les réponses aux questions les plus fréquentes. Posez toute autre question à notre assistant IA.",
    chatTitle: "Assistant IA EBM",
    chatIntro: "Bonjour 👋 Je suis l'assistant d'EBM. Posez-moi vos questions sur les commandes, la livraison, les retours, les paiements ou comment devenir vendeur.",
    placeholder: "Posez une question…",
    send: "Envoyer",
    error: "Désolé, l'assistant est indisponible. Réessayez.",
    suggested: ["Combien de temps pour la livraison ?", "Comment devenir vendeur ?", "Quels moyens de paiement acceptez-vous ?"],
    sections: [
      { heading: "Commandes", items: [
        { q: "Comment passer commande ?", a: "Ajoutez les produits au panier, allez au paiement, choisissez une adresse et un mode de paiement, puis confirmez." },
        { q: "Puis-je commander sans compte ?", a: "Vous pouvez naviguer librement, mais un compte est requis au paiement pour suivre et livrer votre commande." },
      ]},
      { heading: "Livraison", items: [
        { q: "Quel est le délai de livraison ?", a: "En général 1 à 3 jours à Bujumbura et 2 à 5 jours ailleurs au Burundi." },
        { q: "Livrez-vous dans ma province ?", a: "Nous livrons dans les 18 provinces du Burundi. Les frais varient selon la distance." },
      ]},
      { heading: "Paiements", items: [
        { q: "Quels moyens de paiement acceptez-vous ?", a: "Lumicash, mobile money, paiement à la livraison, cartes bancaires (déploiement progressif)." },
        { q: "Mon paiement est-il sécurisé ?", a: "Oui. Les paiements par carte sont traités par des prestataires certifiés — nous ne voyons jamais vos détails de carte." },
      ]},
      { heading: "Vendeurs", items: [
        { q: "Comment devenir vendeur ?", a: "Créez un compte et choisissez « Vendeur » ou « Propriétaire de boutique » à l'inscription. Nos administrateurs valident sous 48h." },
        { q: "Quels frais pour les vendeurs ?", a: "Une petite commission par vente. Pas d'abonnement, pas de frais d'entrée." },
      ]},
      { heading: "Retours", items: [
        { q: "Quelle est votre politique de retour ?", a: "30 jours pour la plupart des produits en état d'origine. Les articles sur mesure ne sont pas remboursables." },
      ]},
    ],
  },
  rn: {
    title: "Ikigo c'Ubufasha",
    subtitle: "Ibisubizo ku bibazo bikunze kubazwa. Baza umufasha wacu wa AI ikindi cyose.",
    chatTitle: "Umufasha AI wa EBM",
    chatIntro: "Muraho 👋 Ndi umufasha wa EBM. Mumbaze ibijanye n'ivyo mwatumije, gutwara, gusubiza, kwishura, canke kuba umugurisha.",
    placeholder: "Baza ikibazo…",
    send: "Rungika",
    error: "Ikibabaje, umufasha ntashoboye kwishura. Mugerageze bundi bushya.",
    suggested: ["Bitwara iminsi ingahe kugeza itanzwe?", "Ninde ashobora kuba umugurisha?", "Ni ubuhe buryo bwo kwishura mwakira?"],
    sections: [
      { heading: "Gutumiza", items: [
        { q: "Ntumiza gute?", a: "Shira ibicuruzwa mu gikapu, ujye ku kwishura, hitamo aho utumije n'uburyo bwo kwishura, wemeze." },
        { q: "Nshobora gutumiza ntafunguye konte?", a: "Urashobora kuraba, mugabo ukeneye konte kugira ngo tugucungere ivyo watumije." },
      ]},
      { heading: "Gutwara", items: [
        { q: "Bitwara iminsi ingahe?", a: "Ubusanzwe iminsi 1 kugeza 3 i Bujumbura n'iminsi 2 kugeza 5 mu bindi bice by'Uburundi." },
        { q: "Muratwara mu ntara yanje?", a: "Turatwara mu ntara zose 18 z'Uburundi. Amahera yo gutwara aratandukanira ku ntera." },
      ]},
      { heading: "Kwishura", items: [
        { q: "Ni ubuhe buryo bwo kwishura mwakira?", a: "Lumicash, mobile money, kwishura ku gihe cyo gutanga, ikarita za banki (biraza gahoro gahoro)." },
        { q: "Kwishura kwanje kurizewe?", a: "Ego. Kwishura kw'ikarita bikorwa n'inzobere zizigiye — ntitworaba amakuru y'ikarita yawe." },
      ]},
      { heading: "Kugurisha", items: [
        { q: "Nshobora gute kuba umugurisha?", a: "Fungura konte, uhitemo \"Umugurisha\" canke \"Nyir'iduka\" mu kwiyandikisha. Abayobozi barasuzuma mu masaha 48." },
        { q: "Ni ayahe mahera abagurisha bariha?", a: "Amahera make ku bicuruzwa vyagurishijwe. Nta magera y'ukwezi, nta n'uwo utanga kera." },
      ]},
      { heading: "Gusubiza", items: [
        { q: "Ni iyihe politiki yo gusubiza?", a: "Iminsi 30 yo gusubiza ibicuruzwa vyinshi mu buryo bwavyo. Ibicuruzwa vyakozwe kubwawe ntibisubizwa." },
      ]},
    ],
  },
};

const LANG_NAMES: Record<Lang, string> = { en: "English", fr: "Français", rn: "Kirundi" };

type Msg = { role: "user" | "assistant"; content: string };

function HelpPage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/help-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang, messages: next }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        setMessages((m) => [...m, { role: "assistant", content: t.error }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: body.reply || t.error }]);
      }
      setTimeout(() => scrollRef.current?.scrollTo({ top: 999_999, behavior: "smooth" }), 50);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: t.error }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => { e.preventDefault(); send(input); };

  return (
    <div className="flex min-h-screen flex-col bg-muted/40">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
            <div className="min-w-0">
              <h1 className="font-display text-3xl font-extrabold md:text-4xl">{t.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground md:text-base">{t.subtitle}</p>
            </div>
            <div className="flex shrink-0 gap-1 rounded-full border bg-background p-1 text-xs font-medium">
              {(["en", "fr", "rn"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`rounded-full px-3 py-1.5 transition ${lang === l ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                >
                  {LANG_NAMES[l]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_420px]">
            {/* FAQ */}
            <div className="space-y-6">
              {t.sections.map((s) => (
                <section key={s.heading} className="rounded-2xl border bg-card p-5 shadow-card">
                  <h2 className="text-lg font-bold">{s.heading}</h2>
                  <dl className="mt-3 space-y-3">
                    {s.items.map((it) => (
                      <div key={it.q}>
                        <dt className="text-sm font-semibold">{it.q}</dt>
                        <dd className="mt-1 text-sm text-muted-foreground">{it.a}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>

            {/* AI chat */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="flex h-[560px] flex-col overflow-hidden rounded-2xl border bg-card shadow-elegant">
                <div className="flex items-center gap-2 border-b bg-primary/5 px-4 py-3">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{t.chatTitle}</p>
                    <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Online · powered by AI
                    </p>
                  </div>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 text-sm">
                  {messages.length === 0 ? (
                    <div className="space-y-3">
                      <p className="text-muted-foreground">{t.chatIntro}</p>
                      <div className="flex flex-wrap gap-2">
                        {t.suggested.map((q) => (
                          <button
                            key={q}
                            onClick={() => send(q)}
                            className="rounded-full border bg-background px-3 py-1.5 text-xs transition hover:border-primary hover:text-primary"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {messages.map((m, i) => (
                        <li key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                          <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-full ${m.role === "user" ? "bg-muted" : "bg-primary text-primary-foreground"}`}>
                            {m.role === "user" ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
                          </div>
                          <div className={`max-w-[85%] rounded-2xl px-3 py-2 leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                            {m.content}
                          </div>
                        </li>
                      ))}
                      {loading && (
                        <li className="flex gap-2">
                          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                            <Bot className="h-3.5 w-3.5" />
                          </div>
                          <div className="rounded-2xl bg-muted px-3 py-2">
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          </div>
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <form onSubmit={onSubmit} className="flex items-center gap-2 border-t bg-background p-3">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.placeholder}
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={loading || !input.trim()} aria-label={t.send}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
