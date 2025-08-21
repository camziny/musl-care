import { createBusiness } from "@/app/actions/businesses";
import { requireRole } from "@/app/actions/userChecks";
import ClientBusinessForm from "./ClientBusinessForm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type FormState = { ok: boolean; message?: string };

async function submit(_: FormState, formData: FormData): Promise<FormState> {
  try {
    const allowed = await requireRole(["premium", "lux", "admin"]);
    if (!allowed.ok) return { ok: false, message: "You do not have permission to submit a business." };

    const payload = {
      name: formData.get("name") as string,
      ownerName: (formData.get("ownerName") as string) || undefined,
      category: formData.get("category") as string,
      description: (formData.get("description") as string) || undefined,
      addressLine: (formData.get("addressLine") as string) || undefined,
      city: (formData.get("city") as string) || undefined,
      state: (formData.get("state") as string) || undefined,
      zip: (formData.get("zip") as string) || undefined,
      website: (formData.get("website") as string) || undefined,
      contactEmail: (formData.get("contactEmail") as string) || undefined,
      contactPhone: (formData.get("contactPhone") as string) || undefined,
      imageUrl: (formData.get("imageUrl") as string) || undefined,
      isMuslimOwned: formData.get("isMuslimOwned") === "on",
      isArabOwned: formData.get("isArabOwned") === "on",
      isSouthAsianOwned: formData.get("isSouthAsianOwned") === "on",
    } as any;
    const row = await createBusiness(payload);
    return { ok: true };
  } catch (e: any) {
    return { ok: false, message: e?.message ?? "Submission failed" };
  }
}

export default async function NewBusinessPage() {
  const allowed = await requireRole(["premium", "lux", "admin"]);
  if (!allowed.ok) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold mb-2">Submit a Business</h1>
        <p className="text-sm text-gray-700">Only Premium or Lux members can submit businesses. Upgrade your account to continue.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Submit a Business</h1>
      <ClientBusinessForm submitAction={submit} />
    </div>
  );
}

 


