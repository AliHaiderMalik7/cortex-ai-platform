"use client";

import { useEffect, useState } from "react";

import { API_URL } from "@/lib/api";
import type { UploadedDoc } from "@/types";

export function useDocuments() {
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/documents`)
      .then((res) => {
        if (!res.ok) throw new Error(`Backend responded with ${res.status}`);
        return res.json();
      })
      .then((data: UploadedDoc[]) => setUploadedDocs(data))
      .catch((err) => setUploadError(err.message));
  }, []);

  async function uploadFile(file: File) {
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`${API_URL}/documents/upload`, {
        method: "POST",
        body: formData, // no Content-Type header - the browser sets the multipart boundary itself
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.detail ?? `Upload failed with ${res.status}`);
      }

      const data: UploadedDoc = await res.json();
      setUploadedDocs((prev) => [data, ...prev]);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setUploading(false);
    }
  }

  return { uploadedDocs, uploading, uploadError, uploadFile };
}
