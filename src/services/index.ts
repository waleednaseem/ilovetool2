import api from "./api";
import { pdfService } from "./pdfService";

export { api, pdfService };

export const healthService = {
  check: () => api.get("/health"),
};
