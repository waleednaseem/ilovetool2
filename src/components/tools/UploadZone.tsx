"use client";

import { useCallback, useRef, useState } from "react";

type Props = {
  multiple?: boolean;
  accept?: string;
  files: File[];
  onChange: (files: File[]) => void;
  label?: string;
};

export default function UploadZone({
  multiple = false,
  accept = "application/pdf",
  files,
  onChange,
  label = "Drop PDF here or click to browse",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const takeFiles = useCallback(
    (list: FileList | null) => {
      if (!list?.length) return;
      const next = Array.from(list).filter(
        (f) =>
          f.type === "application/pdf" ||
          f.name.toLowerCase().endsWith(".pdf") ||
          accept.includes("image")
      );
      if (!next.length) return;
      onChange(multiple ? [...files, ...next] : [next[0]]);
    },
    [accept, files, multiple, onChange]
  );

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          takeFiles(e.dataTransfer.files);
        }}
        className={`flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-10 text-center transition ${
          dragging
            ? "border-teal-600 bg-teal-50"
            : "border-zinc-300 bg-zinc-50 hover:border-teal-600/50"
        }`}
      >
        <span className="text-sm font-medium text-zinc-700">{label}</span>
        <span className="mt-1 text-xs text-zinc-500">PDF only · processed in your browser</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          takeFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {files.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-zinc-600">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-2">
              <span className="truncate">{f.name}</span>
              <button
                type="button"
                className="text-xs text-red-600 hover:underline"
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
