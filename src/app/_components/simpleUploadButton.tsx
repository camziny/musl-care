"use client";

import { useRouter } from "next/navigation";
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";
import { useState } from "react";

type SimpleUploadButtonProps = {
  inputId: string;
};

export function SimpleUploadButton({ inputId }: SimpleUploadButtonProps) {
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);
  const router = useRouter();
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onUploadBegin() {
      console.log("Upload started");
      toast(
        <div className="flex items-center gap-2 text-black">
          <LoadingSpinnerSVG /> <span className="text-lg">Uploading...</span>
        </div>,
        {
          duration: 100000,
          id: "upload-begin",
        }
      );
    },
    onUploadError(error) {
      console.error("Upload error:", error);
      toast.dismiss("upload-begin");
      toast.error("Upload failed");
    },
    onClientUploadComplete(result) {
      console.log("Upload complete:", result);
      toast.dismiss("upload-begin");
      toast(<span className="text-lg">Upload complete!</span>);
      if (result && result.length > 0) {
        const uploadedUrl = result[0].url;
        setLocalImageUrl(uploadedUrl);
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (input) {
          input.value = uploadedUrl;
        } else {
          console.error(`Element with id ${inputId} not found.`);
        }
      }

      router.refresh();
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    try {
      const selectedFiles = Array.from(e.target.files);
      const result = await startUpload(selectedFiles);

      console.log("uploaded files", result);
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <label
        htmlFor="upload-button"
        className="cursor-pointer flex flex-col items-center"
      >
        <UploadSvg />
        {isUploading && (
          <div className="mt-2">
            <LoadingSpinnerSVG />
          </div>
        )}
        {localImageUrl && (
          <div className="mt-2">
            <img
              src={localImageUrl}
              alt="Uploaded Image"
              className="max-w-full h-auto rounded-md"
              style={{ maxWidth: "200px" }}
            />
          </div>
        )}
      </label>
      <input
        id="upload-button"
        type="file"
        className="sr-only"
        onChange={handleFileChange}
        multiple={false}
        accept="image/*"
      />
    </div>
  );
}

function UploadSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}

function LoadingSpinnerSVG() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="black"
      className="spinner"
    >
      <style>
        {`
          @keyframes spinner {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .spinner {
            animation: spinner 1s linear infinite;
          }
        `}
      </style>
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity=".25"
      />
      <path
        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
        className="spinner_ajPY"
      />
    </svg>
  );
}
