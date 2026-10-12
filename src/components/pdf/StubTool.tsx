"use client";

import UploadZone from "@/components/tools/UploadZone";
import { useState } from "react";

export default function StubTool() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
        Coming soon — processing via API. Upload UI is ready; no fake download yet.
      </div>
      <UploadZone files={files} onChange={setFiles} />
      <button
        type="button"
        disabled
        className="rounded-lg bg-gray-300 px-5 py-2.5 text-sm font-medium text-gray-600"
      >
        Process (unavailable)
      </button>
    </div>
  );
}
