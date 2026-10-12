/** Fire-and-forget helpers to persist usage into sabir via Next API. */

export function logToolRun(payload: {
  family: string;
  slug: string;
  title?: string;
  source?: string;
}) {
  if (typeof window === "undefined") return;
  void fetch("/api/activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

export function logConverterRun(payload: {
  slug: string;
  title?: string;
  input?: number | string;
  output?: number | string;
}) {
  if (typeof window === "undefined") return;
  void fetch("/api/converters/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

export function syncFavorite(toolId: string, action: "add" | "remove") {
  if (typeof window === "undefined") return;
  void fetch("/api/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toolId, action }),
  }).catch(() => {});
}

export function syncRecent(toolId: string) {
  if (typeof window === "undefined") return;
  void fetch("/api/recent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ toolId }),
  }).catch(() => {});
}

export function queuePdfJob(payload: {
  slug: string;
  title?: string;
  files: { name: string; size: number; type: string }[];
  note?: string;
  status?: string;
}) {
  if (typeof window === "undefined") return Promise.resolve(null);
  return fetch("/api/jobs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, source: "app" }),
  })
    .then((r) => r.json())
    .catch(() => null);
}

export function saveEsignRequestRemote(meta: Record<string, unknown>) {
  if (typeof window === "undefined") return Promise.resolve(null);
  return fetch("/api/esign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meta),
  })
    .then((r) => r.json())
    .catch(() => null);
}

export async function fetchEsignRequests(): Promise<
  Array<{
    id: string;
    title: string;
    message?: string;
    signers: { name: string; email: string }[];
    status: string;
    createdAt: string;
  }>
> {
  try {
    const res = await fetch("/api/esign");
    const data = await res.json();
    return data.ok ? data.requests : [];
  } catch {
    return [];
  }
}
