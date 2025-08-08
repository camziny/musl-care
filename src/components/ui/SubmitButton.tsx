"use client";

type RegisterButtonProps = {
  formId: string;
};

export default function SubmitButton({ formId }: RegisterButtonProps) {
  const handleClick = async () => {
    try {
      const form = document.getElementById(formId) as HTMLFormElement | null;
      if (!form) return;
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method || "POST",
        body: formData,
      });
      if (response.ok) {
        window.location.href = "/jobs";
      } else {
        const responseData = await response.json().catch(() => null);
        const errorMsg = responseData?.message || response.statusText || "Submission failed";
        alert(errorMsg);
      }
    } catch (e) {
      alert("An unexpected error occurred");
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full mt-4 px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800"
    >
      Submit
    </button>
  );
}
