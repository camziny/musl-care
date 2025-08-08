type Props = { name?: string | null; size?: number };

export function Avatar({ name, size = 32 }: Props) {
  const initials = (name || "U")
    .split(" ")
    .filter(Boolean)
    .map((p) => p[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
  const dimension = `${size}px`;
  return (
    <div
      className="rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-slate-700 flex items-center justify-center font-semibold"
      style={{ width: dimension, height: dimension }}
    >
      <span className="text-xs">{initials}</span>
    </div>
  );
}
