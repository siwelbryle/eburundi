import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/site/static-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { FormEvent } from "react";

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
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    (e.currentTarget as HTMLFormElement).reset();
    toast.success("Message sent — we'll reply within 24h.");
  }
  return (
    <StaticPage title="Contact us" subtitle="We usually reply within 24 hours.">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3 text-sm">
          <p><strong>Email:</strong> <a className="text-primary hover:underline" href="mailto:hello@karamamarket.bi">hello@karamamarket.bi</a></p>
          <p><strong>Phone:</strong> +257 22 00 00 00</p>
          <p><strong>Address:</strong> Avenue de l'Indépendance, Bujumbura, Burundi</p>
          <p><strong>Hours:</strong> Mon–Sat, 08:00–18:00 CAT</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-3 rounded-xl border bg-card p-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={5} required />
          </div>
          <Button type="submit" className="w-full">Send message</Button>
        </form>
      </div>
    </StaticPage>
  );
}
