"use client";

import UploadZone from "@/components/tools/UploadZone";
import { useFavorites } from "@/context";
import { queuePdfJob } from "@/lib/client/persist";
import { downloadBytes, fileToBytes } from "@/lib/pdf/download";
import { unlockPdf } from "@/lib/pdf/protect";
import { useEffect, useState } from "react";

export default function ProtectTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [queueId, setQueueId] = useState<string | null>(null);
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
      await queuePdfJob({
        slug: "unlock",
        title: "Unlock PDF",
        status: "completed",
        files: files.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type || "application/pdf",
        })),
        note: "Unlocked in browser",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to unlock PDF.");
    } finally {
      setBusy(false);
    }
  };

  const queueProtect = async () => {
    setError(null);
    setQueueId(null);
    if (!files[0]) {
      setError("Upload a PDF first.");
      return;
    }
    if (!password.trim()) {
      setError("Enter a password to queue protect.");
      return;
    }
    setBusy(true);
    try {
      const data = await queuePdfJob({
        slug: "protect",
        title: "Protect PDF",
        status: "queued",
        note: "AES encrypt queued (password not stored). Process when API is ready.",
        files: files.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type || "application/pdf",
        })),
      });
      if (!data?.ok) {
        setError(data?.error || "Could not queue protect job.");
        return;
      }
      setQueueId(data.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Queue failed.");
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
          AES encryption needs the processing API. Queue the job in the database
          now (password is not saved).
        </p>
        <input
          type="password"
          placeholder="Password for future encrypt"
          className="mt-3 w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {queueId && (
        <p className="text-sm text-[var(--brand-dark)]">
          Protect job queued — id: {queueId}
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={unlock}
          className="rounded-lg bg-teal-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-900 disabled:opacity-60"
        >
          {busy ? "Working…" : "Unlock & download"}
        </button>
        <button
          type="button"
          disabled={busy || !files.length}
          onClick={queueProtect}
          className="rounded-lg bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-dark)] disabled:opacity-60"
        >
          Queue protect in database
        </button>
      </div>
    </div>
  );
}
