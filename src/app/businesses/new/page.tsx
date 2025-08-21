import { createBusiness } from "@/app/actions/businesses";
import { requireRole } from "@/app/actions/userChecks";
import { SimpleUploadButton } from "@/components/ui/SimpleUploadButton";
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
      <BusinessForm submitAction={submit} />
    </div>
  );
}

"use client";
import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

function BusinessForm({ submitAction }: { submitAction: (state: FormState, formData: FormData) => Promise<FormState> }) {
  const router = useRouter();
  const [state, formAction] = useFormState(submitAction, { ok: false } as FormState);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state?.ok) {
      router.push("/businesses");
    }
  }, [state?.ok, router]);

  return (
    <form action={formAction} className="space-y-6">
      {state?.message ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.message}</div>
      ) : null}
      <fieldset className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Business Name</label>
          <input name="name" required className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Owners Name</label>
          <input name="ownerName" className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select name="category" required className="w-full rounded-md border px-3 py-2">
            <option>Daycare</option>
            <option>Tutoring</option>
            <option>Senior recreation</option>
            <option>Products</option>
            <option>Clothing & Accessories</option>
            <option>Catering</option>
            <option>Food/restaurant</option>
            <option>Umrah/Hajj booking</option>
            <option>Legal services</option>
            <option>Therapists</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" rows={5} className="w-full rounded-md border px-3 py-2" />
        </div>
      </fieldset>
      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Address (optional)</label>
          <input name="addressLine" className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <input name="city" className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">State</label>
          <input name="state" className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Zip</label>
          <input name="zip" className="w-full rounded-md border px-3 py-2" />
        </div>
      </fieldset>
      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Website</label>
          <input name="website" type="url" className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Email</label>
          <input name="contactEmail" type="email" className="w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Contact Phone</label>
          <input name="contactPhone" className="w-full rounded-md border px-3 py-2" />
        </div>
      </fieldset>
      <fieldset className="space-y-3">
        <label className="block text-sm font-medium mb-1">Upload Logo or Image</label>
        <input type="hidden" name="imageUrl" />
        <SimpleUploadButton inputId="imageUrl" />
      </fieldset>
      <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isMuslimOwned" /> Muslim-owned</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isArabOwned" /> Arab-owned</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isSouthAsianOwned" /> South Asian-owned</label>
      </fieldset>
      <SubmitButton pending={pending} />
    </form>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button type="submit" className="w-full rounded-md bg-black text-white py-2" disabled={pending}>
      {pending ? "Submitting..." : "Submit for Review"}
    </button>
  );
}


