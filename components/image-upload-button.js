"use client";

import { useRef } from "react";

export default function ImageUploadButton({ onImageSelect, disabled }) {
  const fileInputRef = useRef(null);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      onImageSelect({
        data: base64,
        mediaType: file.type,
        preview: reader.result,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);

    // Reset so the same file can be re-selected
    e.target.value = "";
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
        className="p-3 text-on-surface-variant transition-colors hover:text-primary disabled:opacity-50"
      >
        <span className="material-symbols-outlined">image</span>
      </button>
    </>
  );
}
