"use client";

import { DocumentsSection } from "@/components/DocumentsSection";
import { useAppState } from "@/context/AppStateContext";

export default function DocumentsPage() {
  const { documentsState, canUploadDocuments } = useAppState();
  return (
    <DocumentsSection
      uploadedDocs={documentsState.uploadedDocs}
      uploading={documentsState.uploading}
      uploadError={documentsState.uploadError}
      onUpload={documentsState.uploadFile}
      canUpload={canUploadDocuments}
    />
  );
}
