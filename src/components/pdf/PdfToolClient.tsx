"use client";

import AddTextTool from "@/components/pdf/AddTextTool";
import CreateFormTool from "@/components/pdf/CreateFormTool";
import CropTool from "@/components/pdf/CropTool";
import EditPdfTool from "@/components/pdf/EditPdfTool";
import EsignRequestTool from "@/components/pdf/EsignRequestTool";
import ExtractImagesTool from "@/components/pdf/ExtractImagesTool";
import ExtractTextTool from "@/components/pdf/ExtractTextTool";
import FillFormTool from "@/components/pdf/FillFormTool";
import JpgToPdfTool from "@/components/pdf/JpgToPdfTool";
import JpgTool from "@/components/pdf/JpgTool";
import MergePdfImagesTool from "@/components/pdf/MergePdfImagesTool";
import MergeTool from "@/components/pdf/MergeTool";
import OrganizeTool from "@/components/pdf/OrganizeTool";
import PageNumbersTool from "@/components/pdf/PageNumbersTool";
import ProtectTool from "@/components/pdf/ProtectTool";
import RotateTool from "@/components/pdf/RotateTool";
import SignTool from "@/components/pdf/SignTool";
import SplitTool from "@/components/pdf/SplitTool";
import StubTool from "@/components/pdf/StubTool";
import UnlockTool from "@/components/pdf/UnlockTool";
import WatermarkTool from "@/components/pdf/WatermarkTool";
import type { PdfToolDef } from "@/lib/pdf/registry";

export default function PdfToolClient({ tool }: { tool: PdfToolDef }) {
  if (tool.mode === "stub") {
    return <StubTool slug={tool.slug} title={tool.title} />;
  }

  switch (tool.slug) {
    case "merge":
      return <MergeTool />;
    case "merge-pdf-images":
      return <MergePdfImagesTool />;
    case "split":
      return <SplitTool />;
    case "extract-text":
      return <ExtractTextTool />;
    case "sign":
      return <SignTool />;
    case "esign-request":
      return <EsignRequestTool />;
    case "fill-form":
      return <FillFormTool />;
    case "create-form":
      return <CreateFormTool />;
    case "add-text":
      return <AddTextTool />;
    case "edit":
      return <EditPdfTool />;
    case "organize":
      return <OrganizeTool />;
    case "rotate":
      return <RotateTool />;
    case "protect":
      return <ProtectTool />;
    case "unlock":
      return <UnlockTool />;
    case "pdf-to-jpg":
      return <JpgTool />;
    case "extract-images":
      return <ExtractImagesTool />;
    case "jpg-to-pdf":
      return <JpgToPdfTool />;
    case "watermark":
      return <WatermarkTool />;
    case "page-numbers":
      return <PageNumbersTool />;
    case "crop":
      return <CropTool />;
    default:
      return <StubTool slug={tool.slug} title={tool.title} />;
  }
}
