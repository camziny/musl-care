"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SimpleUploadButton } from "@/components/ui/SimpleUploadButton";
import LanguageSelect from "@/components/ui/LanguageSelect";
import SectSelect from "@/components/ui/SectSelect";
import EthnicBackgroundSelect from "@/components/ui/EthnicBackgroundSelect";
import SelectAvailability from "@/components/caregivers/SelectAvailability";
import type { FormState } from "./page";

export default function ClientRegisterForm({ registerAction }: { registerAction: (state: FormState, formData: FormData) => Promise<FormState> }) {
  const router = useRouter();
  const initialState = { ok: false, message: undefined } as FormState;
  const [state, formAction] = useFormState(registerAction, initialState);
  const { pending } = useFormStatus();

  useEffect(() => {
    if (state?.ok) {
      toast.success("Profile created");
      router.push("/caregivers");
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state?.ok, state?.message, router]);

  return (
    <form id="caregiver-form" action={formAction} method="post" className="space-y-8">
      {state?.message && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.message}</div>
      )}
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-slate-900">Profile Image</legend>
        <input type="hidden" name="imageUrl" />
        <SimpleUploadButton inputId="imageUrl" />
      </fieldset>
      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <legend className="sr-only">Basic Info</legend>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
          <input name="name" autoComplete="name" className="w-full rounded border border-slate-300 bg-white p-3" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <input name="phoneNumber" type="tel" inputMode="tel" pattern="[0-9()+\-\.\s]{7,}" title="Enter a valid phone" autoComplete="tel" className="w-full rounded border border-slate-300 bg-white p-3" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">About You</label>
          <textarea name="description" className="w-full rounded border border-slate-300 bg-white p-3" rows={4} required />
        </div>
      </fieldset>
      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <legend className="text-sm font-semibold text-slate-900 mb-2 md:col-span-2">Address</legend>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
          <input name="address" autoComplete="street-address" className="w-full rounded border border-slate-300 bg-white p-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
          <input name="city" autoComplete="address-level2" className="w-full rounded border border-slate-300 bg-white p-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
          <input name="state" autoComplete="address-level1" className="w-full rounded border border-slate-300 bg-white p-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Postal Code</label>
          <input name="postalCode" autoComplete="postal-code" className="w-full rounded border border-slate-300 bg-white p-3" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
          <input name="country" autoComplete="country-name" className="w-full rounded border border-slate-300 bg-white p-3" />
        </div>
      </fieldset>
      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <legend className="text-sm font-semibold text-slate-900 mb-2 md:col-span-2">Background</legend>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Languages</label>
          <LanguageSelect inputId="languages" />
          <input type="hidden" id="languages" name="languages" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sect</label>
          <SectSelect inputId="sect" />
          <input type="hidden" id="sect" name="sect" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Ethnic Background</label>
          <EthnicBackgroundSelect inputId="ethnicBackground" />
          <input type="hidden" id="ethnicBackground" name="ethnicBackground" />
        </div>
      </fieldset>
      <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <legend className="text-sm font-semibold text-slate-900 mb-2 md:col-span-2">Rates</legend>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate (Min)</label>
          <input name="hourlyRateMin" type="number" inputMode="decimal" min="0" step="0.5" className="w-full rounded border border-slate-300 bg-white p-3" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Hourly Rate (Max)</label>
          <input name="hourlyRateMax" type="number" inputMode="decimal" min="0" step="0.5" className="w-full rounded border border-slate-300 bg-white p-3" />
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900 mb-2">Availability</legend>
        <SelectAvailability inputId="availability" />
        <input type="hidden" id="availability" name="availability" />
      </fieldset>
      <SubmitButton pending={pending} />
    </form>
  );
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button type="submit" disabled={pending} className="w-full mt-2 px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed">
      {pending ? "Submitting..." : "Create Profile"}
    </button>
  );
}