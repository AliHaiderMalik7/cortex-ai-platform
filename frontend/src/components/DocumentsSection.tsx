"use client";

import { useRef } from "react";

import { IconFile, IconUpload } from "./icons";
import type { UploadedDoc } from "@/types";

type DocumentsSectionProps = {
  uploadedDocs: UploadedDoc[];
  uploading: boolean;
  uploadError: string | null;
  onUpload: (file: File) => void;
  canUpload: boolean;
};

export function DocumentsSection({
  uploadedDocs,
  uploading,
  uploadError,
  onUpload,
  canUpload,
}: DocumentsSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (file) onUpload(file);
  }

  return (
    <section id="documents" className="scroll-mt-20">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <IconUpload />
        </span>
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Documents</h2>
        {uploadedDocs.length > 0 && (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {uploadedDocs.length}
          </span>
        )}
      </div>

      <div className="rounded-xl border border-zinc-100 bg-white p-5 shadow-md shadow-zinc-200/40 dark:border-zinc-800/60 dark:bg-zinc-900 dark:shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Upload a PDF to add it to Cortex&apos;s knowledge base.
          </p>

          {canUpload ? (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleFileSelected}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-50"
              >
                <IconUpload />
                {uploading ? "Uploading…" : "Upload PDF"}
              </button>
            </>
          ) : (
            <span className="shrink-0 rounded-lg bg-zinc-100 px-3.5 py-2 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              Agent/admin sign-in required to upload
            </span>
          )}
        </div>

        {uploadError && <p className="mt-4 text-sm text-rose-600 dark:text-rose-400">{uploadError}</p>}

        {uploadedDocs.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
            {uploadedDocs.map((doc, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-lg border border-transparent bg-zinc-50 px-3.5 py-2.5 text-sm transition-colors hover:border-zinc-200 dark:bg-zinc-800/60 dark:hover:border-zinc-700"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 ring-1 ring-zinc-200 dark:bg-zinc-900 dark:text-indigo-400 dark:ring-zinc-700">
                  <IconFile />
                </span>
                <span className="min-w-0 flex-1 truncate font-medium text-zinc-800 dark:text-zinc-200">
                  {doc.filename}
                </span>
                <span className="shrink-0 text-xs text-zinc-400 dark:text-zinc-500">
                  {doc.pages} {doc.pages === 1 ? "page" : "pages"} · {doc.chunks_stored}{" "}
                  {doc.chunks_stored === 1 ? "chunk" : "chunks"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
