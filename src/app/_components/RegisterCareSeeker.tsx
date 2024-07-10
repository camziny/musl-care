import React from "react";
import { registerCareSeeker } from "@/server/db/queries";
import RegisterButton from "../_components/RegisterButton";

export default function RegisterCareSeeker() {
  const handleSubmit = async (formData: FormData) => {
    "use server";

    try {
      await registerCareSeeker();
      console.log("Care seeker registered successfully");
    } catch (error) {
      console.error("Error registering care seeker:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-blue-700 p-8 border border-gray-700 rounded-md shadow-lg my-5">
      <h1 className="text-2xl font-bold text-white mb-6">
        Care Seeker Registration Form
      </h1>
      <form
        id="care-seeker-form"
        action={handleSubmit}
        method="post"
        className="space-y-6"
      >
        <RegisterButton formId="care-seeker-form" />
      </form>
    </div>
  );
}
