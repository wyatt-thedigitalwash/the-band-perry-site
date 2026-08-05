"use client";

import { useEffect } from "react";
import SubscribeForm from "@/components/SubscribeForm";

export default function SubscribeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  // Escape to close + lock body scroll while the dialog is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="subscribe-modal-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 cursor-default"
        tabIndex={-1}
      />

      {/* Panel */}
      <div className="relative z-10 max-h-[90dvh] w-full max-w-md overflow-y-auto border border-[#AADCF8]/30 bg-[#0A0A0A] p-6 sm:p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close subscribe form"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center text-[#FAFAFA]/60 transition-colors hover:text-[#AADCF8]"
        >
          <span aria-hidden="true" className="text-xl leading-none">&times;</span>
        </button>

        <h2
          id="subscribe-modal-title"
          className="text-center text-lg uppercase tracking-[0.2em] text-[#FAFAFA]"
        >
          Join the List
        </h2>

        <SubscribeForm idPrefix="modal" autoFocusFirst />
      </div>
    </div>
  );
}
