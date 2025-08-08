import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact",
  description: "Placeholder description for contact page",
};
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Contact() {
  return (
    <section className="relative py-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white" />
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-slate-900">Contact Us</h1>
          <p className="mt-3 text-slate-600">Questions, feedback, or partnership ideas? Reach out any time and we’ll get back to you promptly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Send us a message</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" method="post" action="#">
                <div className="col-span-1">
                  <label className="block text-sm text-slate-600 mb-1">Full name</label>
                  <input className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" placeholder="Jane Doe" />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm text-slate-600 mb-1">Email</label>
                  <input type="email" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" placeholder="jane@example.com" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Subject</label>
                  <input className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300" placeholder="How can we help?" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-slate-600 mb-1">Message</label>
                  <textarea className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-slate-300" placeholder="Share a few details..." />
                </div>
                <div className="md:col-span-2 flex items-center justify-between">
                  <p className="text-xs text-slate-500">This form is a demo. For urgent inquiries, email us directly.</p>
                  <div className="flex items-center gap-2">
                    <Link href="mailto:contact@appname.com" className="rounded-md border border-gray-200 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">Email us</Link>
                    <button type="submit" className="rounded-md bg-slate-900 text-white px-4 py-2 text-sm">Send message</button>
                  </div>
                </div>
              </form>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Operating hours (EST)</h2>
              <dl className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-slate-700">
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"><dt>Mon</dt><dd>9am – 5pm</dd></div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"><dt>Tue</dt><dd>9am – 5pm</dd></div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"><dt>Wed</dt><dd>9am – 5pm</dd></div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"><dt>Thu</dt><dd>9am – 5pm</dd></div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"><dt>Fri</dt><dd>9am – 5pm</dd></div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"><dt>Sat</dt><dd>Closed</dd></div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2"><dt>Sun</dt><dd>Closed</dd></div>
              </dl>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Get in touch</h2>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <span className="rounded-md bg-slate-100 p-2 text-slate-700"><Phone className="h-4 w-4" /></span>
                  <span className="text-slate-700">(123) 456-7890</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="rounded-md bg-slate-100 p-2 text-slate-700"><Mail className="h-4 w-4" /></span>
                  <span className="text-slate-700">contact@appname.com</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="rounded-md bg-slate-100 p-2 text-slate-700"><MapPin className="h-4 w-4" /></span>
                  <span className="text-slate-700">123 Main St, Boston, MA, United States</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="rounded-md bg-slate-100 p-2 text-slate-700"><Clock className="h-4 w-4" /></span>
                  <span className="text-slate-700">Mon–Fri, 9am–5pm</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Follow us</h2>
              <div className="flex items-center gap-3">
                <Link href="#" aria-label="Facebook" className="rounded-full border border-gray-200 p-2 hover:bg-slate-50"><Facebook className="h-4 w-4 text-slate-700" /></Link>
                <Link href="#" aria-label="Twitter" className="rounded-full border border-gray-200 p-2 hover:bg-slate-50"><Twitter className="h-4 w-4 text-slate-700" /></Link>
                <Link href="#" aria-label="Instagram" className="rounded-full border border-gray-200 p-2 hover:bg-slate-50"><Instagram className="h-4 w-4 text-slate-700" /></Link>
                <Link href="#" aria-label="LinkedIn" className="rounded-full border border-gray-200 p-2 hover:bg-slate-50"><Linkedin className="h-4 w-4 text-slate-700" /></Link>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Our location</h2>
              <div className="aspect-[4/3] w-full rounded-lg bg-gradient-to-br from-slate-100 to-slate-200" />
              <p className="mt-3 text-xs text-slate-500">Map placeholder</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

