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

const GRID_COLS = "grid-cols-[32px_1fr_80px_90px]";

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
    <section>
      <div className="mb-4 flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-500/10 text-violet-400">
          <IconUpload />
        </span>
        <h2 className="text-sm font-semibold text-zinc-100">Documents</h2>
        {uploadedDocs.length > 0 && (
          <span className="rounded-full bg-zinc-700 px-2 py-0.5 text-xs font-semibold text-zinc-400">
            {uploadedDocs.length}
          </span>
        )}
      </div>

      <div className="rounded-md border border-zinc-700 bg-zinc-800 shadow-lg shadow-black/20">
        <div className="flex flex-col gap-3 border-b border-zinc-700 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">Upload a PDF to add it to Cortex&apos;s knowledge base.</p>

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
                className="flex shrink-0 items-center justify-center gap-2 rounded-md bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-500 hover:shadow-md active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100"
              >
                {uploading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <IconUpload />
                )}
                {uploading ? "Uploading…" : "Upload PDF"}
              </button>
            </>
          ) : (
            <span className="shrink-0 rounded-md bg-zinc-700 px-3.5 py-2 text-xs font-medium text-zinc-400">
              Agent/admin sign-in required to upload
            </span>
          )}
        </div>

        {uploadError && <p className="animate-fade-in-up px-5 py-3 text-sm text-rose-400">{uploadError}</p>}

        {uploadedDocs.length > 0 && (
          <div className="overflow-x-auto">
            <div className="min-w-[420px]">
              <div
                className={`grid ${GRID_COLS} items-center gap-3 border-b border-zinc-700 bg-zinc-900/40 px-5 py-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500`}
              >
                <span />
                <span>Name</span>
                <span>Pages</span>
                <span>Chunks</span>
              </div>

              <ul className="divide-y divide-zinc-700">
                {uploadedDocs.map((doc, i) => (
                  <li
                    key={i}
                    style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
                    className={`animate-fade-in-up grid ${GRID_COLS} items-center gap-3 px-5 py-3 text-sm transition-colors hover:bg-zinc-700/30`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-700 text-violet-400">
                      <IconFile />
                    </span>
                    <span className="min-w-0 truncate font-medium text-zinc-200">{doc.filename}</span>
                    <span className="text-xs text-zinc-500">{doc.pages}</span>
                    <span className="text-xs text-zinc-500">{doc.chunks_stored}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
