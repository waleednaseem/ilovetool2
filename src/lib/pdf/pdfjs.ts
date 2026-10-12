"use client";

import {
  GlobalWorkerOptions,
  getDocument,
  type PDFDocumentProxy,
} from "pdfjs-dist";

let workerReady = false;

export function ensurePdfjsWorker() {
  if (workerReady || typeof window === "undefined") return;
  // Prefer local worker (avoids CDN / CORS issues)
  GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  workerReady = true;
}

export async function loadPdfDocument(
  data: Uint8Array
): Promise<PDFDocumentProxy> {
  ensurePdfjsWorker();
  const copy = Uint8Array.from(data);
  const loadingTask = getDocument({ data: copy });
  return loadingTask.promise;
}
