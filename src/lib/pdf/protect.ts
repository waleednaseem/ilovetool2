import { loadPdfForEdit, savePdf } from "./load";

/**
 * Acrobat-compatible AES password encryption needs a server/qpdf pipeline.
 * Browser pdf-lib cannot write encrypted PDFs yet.
 */
export async function protectPdf(
  _bytes: Uint8Array,
  userPassword: string
): Promise<Uint8Array> {
  if (!userPassword.trim()) {
    throw new Error("Enter a password to protect this PDF.");
  }
  throw new Error(
    "Password encryption (Acrobat-compatible) needs the API backend. Unlock already works in your browser."
  );
}

/** Re-save without encryption when the file can be opened with ignoreEncryption. */
export async function unlockPdf(bytes: Uint8Array): Promise<Uint8Array> {
  const doc = await loadPdfForEdit(bytes, { ignoreEncryption: true });
  return savePdf(doc);
}
