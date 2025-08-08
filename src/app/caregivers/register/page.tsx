import React from "react";
import { auth } from "@clerk/nextjs/server";
import { db, careGivers, userTypeEnum } from "@/server/db/schema";
import ClientRegisterForm from "./ClientRegisterForm";
import { SimpleUploadButton } from "@/components/ui/SimpleUploadButton";
import LanguageSelect from "@/components/ui/LanguageSelect";
import SectSelect from "@/components/ui/SectSelect";
import EthnicBackgroundSelect from "@/components/ui/EthnicBackgroundSelect";
import SelectAvailability from "@/components/caregivers/SelectAvailability";

export type FormState = { ok: boolean; message?: string };

async function registerAction(_: FormState, formData: FormData): Promise<FormState> {
  "use server";
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) return { ok: false, message: "Please sign in" };

  const name = (formData.get("name") as string)?.trim();
  const phoneNumber = (formData.get("phoneNumber") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  if (!name || !phoneNumber || !description) return { ok: false, message: "Name, phone, and about you are required" };

  const hourlyRateMin = Number(formData.get("hourlyRateMin") || 0);
  const hourlyRateMax = Number(formData.get("hourlyRateMax") || 0);
  if (hourlyRateMin < 0 || hourlyRateMax < 0) return { ok: false, message: "Hourly rates must be non-negative" };
  if (hourlyRateMax && hourlyRateMin && hourlyRateMax < hourlyRateMin) return { ok: false, message: "Max rate must be ≥ min rate" };

  const imageUrl = (formData.get("imageUrl") as string) || "";
  const languages = ((formData.get("languages") as string) || "").split(",").filter(Boolean);
  const sect = (formData.get("sect") as string) || "";
  const ethnicBackground = ((formData.get("ethnicBackground") as string) || "").split(",").filter(Boolean);
  const address = (formData.get("address") as string) || "";
  const city = (formData.get("city") as string) || "";
  const state = (formData.get("state") as string) || "";
  const postalCode = (formData.get("postalCode") as string) || "";
  const country = (formData.get("country") as string) || "";
  const availabilityJson = (formData.get("availability") as string) || "[]";
  let availabilityParsed: any = [];
  try { availabilityParsed = JSON.parse(availabilityJson); } catch {}

  const user = await db.query.users.findFirst({ where: (m, { eq }) => eq(m.clerkUserId, clerkUserId) });
  if (!user) return { ok: false, message: "User not found" };

  await db.insert(careGivers).values({
    name,
    description,
    image: JSON.stringify({ url: imageUrl, alt: "Profile picture" }),
    phoneNumber,
    address,
    city,
    state,
    postalCode,
    country,
    userType: userTypeEnum.enumValues[0],
    userId: user.id,
    subscribed: false,
    languages,
    sect,
    ethnicBackground,
    careType: null,
    religion: null,
    muslimSect: null,
    agesServed: [],
    careCapacity: null,
    termOfCare: null,
    hourlyRateMin: String(hourlyRateMin || 0),
    hourlyRateMax: String(hourlyRateMax || 0),
    yearsExperience: null,
    aboutMe: null,
    availability: JSON.stringify(availabilityParsed),
    availabilityType: null,
    canCook: false,
    hasTransportation: false,
    canShopErrands: false,
    canHelpWithPets: false,
    canClean: false,
    canOrganize: false,
    canTutor: false,
    canPack: false,
    canMealPrep: false,
    isVaccinated: false,
    isSmoker: false,
    firstAidTraining: false,
    cprTraining: false,
    specialNeedsCare: false,
    backgroundChecked: false,
  });

  return { ok: true };
}

export default function CareGiverRegisterPage() {

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Caregiver Registration</h1>
        <p className="text-slate-600 mt-1">Create your caregiver profile</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <ClientRegisterForm registerAction={registerAction} />
      </div>
    </div>
  );
}

function ClientRegisterForm_() {
  "use client";
  const ReactNS = require("react");
  const { useFormState, useFormStatus } = require("react-dom");
  const { useEffect } = ReactNS;
  const { useRouter } = require("next/navigation");
  const { toast } = require("sonner");
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
          <input name="phoneNumber" type="tel" inputMode="tel" pattern="[0-9()+\-.\s]{7,}" title="Enter a valid phone" autoComplete="tel" className="w-full rounded border border-slate-300 bg-white p-3" required />
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
  "use client";
  return (
    <button type="submit" disabled={pending} className="w-full mt-2 px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed">
      {pending ? "Submitting..." : "Create Profile"}
    </button>
  );
}
