import { CheckCircle2, Handshake, Sparkles } from "lucide-react";

export function FeatureTiles() {
  const items = [
    { title: "Verified caregivers", desc: "Every caregiver is vetted for safety and reliability", Icon: CheckCircle2, color: "from-emerald-50 to-emerald-100 text-emerald-700" },
    { title: "Cultural alignment", desc: "Care from professionals who share your values", Icon: Handshake, color: "from-blue-50 to-blue-100 text-blue-700" },
    { title: "Easy matching", desc: "A streamlined process designed around your needs", Icon: Sparkles, color: "from-violet-50 to-violet-100 text-violet-700" },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((it, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-sm transition-shadow">
          <div className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-b ${it.color} h-11 w-11`}>
            <it.Icon className="h-5 w-5" />
          </div>
          <div className="mt-3 text-base font-semibold text-slate-900">{it.title}</div>
          <div className="mt-1 text-sm text-slate-600">{it.desc}</div>
        </div>
      ))}
    </div>
  );
}
