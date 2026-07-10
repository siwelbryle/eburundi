import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/static-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { useState, type FormEvent } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact · EBM" },
      { name: "description", content: "Get in touch with the EBM team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? ""), // honeypot
    };
    if (!payload.name || !payload.email || payload.message.length < 5) {
      toast.error("Please fill in your name, email and a short message.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) {
        toast.error(body.error ?? "Couldn't send your message. Please try again.");
      } else {
        form.reset();
        toast.success("Message sent — we'll reply within 24h.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <StaticPage title="Contact us" subtitle="We usually reply within 24 hours.">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="font-semibold">Email</p>
              <a className="block break-all text-primary hover:underline" href="mailto:eburundimarket@gmail.com">
                eburundimarket@gmail.com
              </a>
              <a className="block break-all text-primary hover:underline" href="mailto:siwelbryl@gmail.com">
                siwelbryl@gmail.com
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="font-semibold">Phone / WhatsApp</p>
              <a className="text-primary hover:underline" href="tel:+25769393285">+257 69 393 285</a>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="font-semibold">Address</p>
              <p className="text-muted-foreground">Avenue de l'Indépendance, Bujumbura, Burundi</p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="font-semibold">Hours</p>
              <p className="text-muted-foreground">Mon–Sat · 08:00–18:00 CAT</p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 rounded-xl border bg-card p-5">
          {/* Honeypot: hidden from users, bots fill it. */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" />
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required maxLength={100} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required maxLength={255} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" name="message" rows={5} required minLength={5} maxLength={4000} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send message"}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Your message is delivered securely to our team inbox.
          </p>
        </form>
      </div>
    </StaticPage>
  );
}
