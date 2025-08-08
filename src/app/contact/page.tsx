import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact",
  description: "Placeholder description for contact page",
};
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Contact() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted to-background" />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-foreground">Contact Us</h1>
          <p className="mt-3 text-muted-foreground">Questions, feedback, or partnership ideas? Reach out any time and we’ll get back to you promptly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Send us a message</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" method="post" action="#">
                <div className="col-span-1">
                  <label className="block text-sm text-muted-foreground mb-1">Full name</label>
                  <input className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Jane Doe" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm text-muted-foreground mb-1">Email</label>
                  <input type="email" className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="jane@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-muted-foreground mb-1">Subject</label>
                  <input className="w-full rounded-md border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="How can we help?" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-muted-foreground mb-1">Message</label>
                  <textarea className="w-full rounded-md border border-border px-3 py-2 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Share a few details..." />
                </div>
                <div className="md:col-span-2 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">This form is a demo. For urgent inquiries, email us directly.</p>
                  <div className="flex items-center gap-2">
                    <Link href="mailto:contact@appname.com">
                      <Button variant="outline">Email us</Button>
                    </Link>
                    <Button type="submit">Send message</Button>
                  </div>
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Operating hours (EST)</h2>
              <dl className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-foreground">
                <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2"><dt>Mon</dt><dd>9am – 5pm</dd></div>
                <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2"><dt>Tue</dt><dd>9am – 5pm</dd></div>
                <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2"><dt>Wed</dt><dd>9am – 5pm</dd></div>
                <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2"><dt>Thu</dt><dd>9am – 5pm</dd></div>
                <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2"><dt>Fri</dt><dd>9am – 5pm</dd></div>
                <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2"><dt>Sat</dt><dd>Closed</dd></div>
                <div className="flex items-center justify-between rounded-md bg-muted px-3 py-2"><dt>Sun</dt><dd>Closed</dd></div>
              </dl>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Get in touch</h2>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <span className="rounded-md bg-muted p-2 text-foreground"><Phone className="h-4 w-4" /></span>
                  <span className="text-foreground">(123) 456-7890</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="rounded-md bg-muted p-2 text-foreground"><Mail className="h-4 w-4" /></span>
                  <span className="text-foreground">contact@appname.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="rounded-md bg-muted p-2 text-foreground"><MapPin className="h-4 w-4" /></span>
                  <span className="text-foreground">123 Main St, Boston, MA, United States</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="rounded-md bg-muted p-2 text-foreground"><Clock className="h-4 w-4" /></span>
                  <span className="text-foreground">Mon–Fri, 9am–5pm</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Follow us</h2>
              <div className="flex items-center gap-3">
                <Link href="#" aria-label="Facebook" className="rounded-full border border-border p-2 hover:bg-accent/10"><Facebook className="h-4 w-4 text-muted-foreground" /></Link>
                <Link href="#" aria-label="Twitter" className="rounded-full border border-border p-2 hover:bg-accent/10"><Twitter className="h-4 w-4 text-muted-foreground" /></Link>
                <Link href="#" aria-label="Instagram" className="rounded-full border border-border p-2 hover:bg-accent/10"><Instagram className="h-4 w-4 text-muted-foreground" /></Link>
                <Link href="#" aria-label="LinkedIn" className="rounded-full border border-border p-2 hover:bg-accent/10"><Linkedin className="h-4 w-4 text-muted-foreground" /></Link>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Our location</h2>
              <div className="aspect-[4/3] w-full rounded-lg bg-gradient-to-br from-muted to-accent/30" />
              <p className="mt-3 text-xs text-muted-foreground">Map placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

