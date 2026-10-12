import api from "./api";

const multipart = {
  headers: { "Content-Type": "multipart/form-data" },
  responseType: "blob" as const,
};

/**
 * Axios contracts for backend PDF processing (iLovePDF-parity API later).
 * Client-side tools do not call these yet.
 */
export const pdfService = {
  merge: (formData: FormData) => api.post("/pdf/merge", formData, multipart),
  split: (formData: FormData) => api.post("/pdf/split", formData, multipart),
  compress: (formData: FormData) =>
    api.post("/pdf/compress", formData, multipart),
  organize: (formData: FormData) =>
    api.post("/pdf/organize", formData, multipart),
  rotate: (formData: FormData) => api.post("/pdf/rotate", formData, multipart),
  repair: (formData: FormData) => api.post("/pdf/repair", formData, multipart),
  crop: (formData: FormData) => api.post("/pdf/crop", formData, multipart),
  compare: (formData: FormData) =>
    api.post("/pdf/compare", formData, multipart),
  convert: (formData: FormData, target: string) =>
    api.post(`/pdf/convert/${target}`, formData, multipart),
  pdfToWord: (formData: FormData) =>
    api.post("/pdf/convert/word", formData, multipart),
  pdfToPowerpoint: (formData: FormData) =>
    api.post("/pdf/convert/powerpoint", formData, multipart),
  pdfToExcel: (formData: FormData) =>
    api.post("/pdf/convert/excel", formData, multipart),
  wordToPdf: (formData: FormData) =>
    api.post("/pdf/convert/from-word", formData, multipart),
  powerpointToPdf: (formData: FormData) =>
    api.post("/pdf/convert/from-powerpoint", formData, multipart),
  excelToPdf: (formData: FormData) =>
    api.post("/pdf/convert/from-excel", formData, multipart),
  pdfToJpg: (formData: FormData) =>
    api.post("/pdf/convert/jpg", formData, multipart),
  extractImages: (formData: FormData) =>
    api.post("/pdf/extract-images", formData, multipart),
  jpgToPdf: (formData: FormData) =>
    api.post("/pdf/convert/from-jpg", formData, multipart),
  createForm: (formData: FormData) =>
    api.post("/pdf/create-form", formData, multipart),
  esignRequest: (formData: FormData) =>
    api.post("/pdf/esign-request", formData, multipart),
  htmlToPdf: (payload: { url: string }) =>
    api.post("/pdf/convert/html", payload, { responseType: "blob" }),
  pdfToPdfa: (formData: FormData) =>
    api.post("/pdf/convert/pdfa", formData, multipart),
  pdfToMarkdown: (formData: FormData) =>
    api.post("/pdf/convert/markdown", formData, multipart),
  edit: (formData: FormData) => api.post("/pdf/edit", formData, multipart),
  sign: (formData: FormData) => api.post("/pdf/sign", formData, multipart),
  watermark: (formData: FormData) =>
    api.post("/pdf/watermark", formData, multipart),
  pageNumbers: (formData: FormData) =>
    api.post("/pdf/page-numbers", formData, multipart),
  redact: (formData: FormData) => api.post("/pdf/redact", formData, multipart),
  fillForm: (formData: FormData) =>
    api.post("/pdf/fill-form", formData, multipart),
  ocr: (formData: FormData) => api.post("/pdf/ocr", formData, multipart),
  unlock: (formData: FormData) => api.post("/pdf/unlock", formData, multipart),
  protect: (formData: FormData) =>
    api.post("/pdf/protect", formData, multipart),
  summarize: (formData: FormData) =>
    api.post("/pdf/ai/summarize", formData, multipart),
  translate: (formData: FormData) =>
    api.post("/pdf/ai/translate", formData, multipart),
  scanToPdf: (formData: FormData) =>
    api.post("/pdf/scan", formData, multipart),
};
