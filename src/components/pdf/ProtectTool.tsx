"use client";

import UploadZone from "@/components/tools/UploadZone";
import { useFavorites } from "@/context";
import { downloadBytes, fileToBytes } from "@/lib/pdf/download";
import { unlockPdf } from "@/lib/pdf/protect";
import { useEffect, useState } from "react";

export default function ProtectTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { addRecent } = useFavorites();

  useEffect(() => {
    addRecent("pdf:protect");
  }, [addRecent]);

  const unlock = async () => {
    setError(null);
    if (!files[0]) {
      setError("Upload a PDF first.");
      return;
    }
    setBusy(true);
    try {
      const bytes = await fileToBytes(files[0]);
      const out = await unlockPdf(bytes);
      downloadBytes(out, "unlocked.pdf");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to unlock PDF.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <UploadZone files={files} onChange={setFiles} />
      <div className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950">
        <p className="font-medium">Unlock (in-browser)</p>
        <p className="mt-1 text-teal-900/80">
          Removes soft locks from many Acrobat PDFs so you can edit them here.
        </p>
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        <p className="font-medium">Password protect</p>
        <p className="mt-1 text-amber-900/80">
          Acrobat-compatible AES encryption needs the backend API (coming soon). Use
          Unlock now for editing.
        </p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        disabled={busy}
        onClick={unlock}
        className="rounded-lg bg-teal-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-900 disabled:opacity-60"
      >
        {busy ? "Working…" : "Unlock & download"}
      </button>
    </div>
  );
}
