import { CheckCircle2, Handshake, Sparkles } from "lucide-react";

export function FeatureTiles() {
  const items = [
    { title: "Verified caregivers", desc: "Every caregiver is vetted for safety and reliability", Icon: CheckCircle2, color: "from-primary/10 to-primary/20 text-primary" },
    { title: "Cultural alignment", desc: "Care from professionals who share your values", Icon: Handshake, color: "from-secondary/10 to-secondary/20 text-secondary" },
    { title: "Easy matching", desc: "A streamlined process designed around your needs", Icon: Sparkles, color: "from-accent/10 to-accent/20 text-accent" },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((it, i) => (
        <div key={i} className="rounded-2xl border border-border/50 bg-card/70 backdrop-blur-sm p-5 hover:shadow-sm transition-shadow">
          <div className={`inline-flex items-center justify-center rounded-xl bg-gradient-to-b ${it.color} h-11 w-11`}>
            <it.Icon className="h-5 w-5" />
          </div>
          <div className="mt-3 text-base font-semibold text-foreground">{it.title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{it.desc}</div>
        </div>
      ))}
    </div>
  );
}
