import { db } from "@/server/db/schema";
import { requireRole } from "@/app/actions/userChecks";
import { adminSetBusinessStatus } from "@/app/actions/businesses";

export const dynamic = "force-dynamic";

export default async function AdminBusinessesPage() {
  const gate = await requireRole(["admin"]);
  if (!gate.ok) return <div className="mx-auto max-w-5xl px-4 py-10">Forbidden</div>;
  const rows = await db.query.businesses.findMany({ orderBy: (m, { desc }) => desc(m.createdAt) });
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Businesses Moderation</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Name</th>
            <th className="py-2">Category</th>
            <th className="py-2">Owner</th>
            <th className="py-2">Location</th>
            <th className="py-2">Status</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.name}</td>
              <td className="py-2">{r.category}</td>
              <td className="py-2">{r.ownerName}</td>
              <td className="py-2">{[r.city, r.state].filter(Boolean).join(", ")}</td>
              <td className="py-2">{r.status}</td>
              <td className="py-2">
                <form action={async () => { 'use server'; await adminSetBusinessStatus(r.slug, 'approved'); }}>
                  <button type="submit" className="mr-2 rounded bg-green-600 px-2 py-1 text-white">Approve</button>
                </form>
                <form action={async () => { 'use server'; await adminSetBusinessStatus(r.slug, 'rejected'); }}>
                  <button type="submit" className="rounded bg-red-600 px-2 py-1 text-white">Reject</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


