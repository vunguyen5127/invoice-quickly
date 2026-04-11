"use client";

import React, { useState, useRef, KeyboardEvent } from "react";
import { Send, Loader2, X, Mail } from "lucide-react";

// ─── Email validation ───────────────────────────────────────────────────────
const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

// ─── EmailChipInput ──────────────────────────────────────────────────────────
interface EmailChipInputProps {
  emails: string[];
  setEmails: (emails: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  id?: string;
}

function EmailChipInput({
  emails,
  setEmails,
  disabled,
  placeholder = "Add email…",
  id,
}: EmailChipInputProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addEmail = (raw: string) => {
    // Support pasting multiple comma/semicolon/space-separated emails
    const parts = raw
      .split(/[,;\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (!parts.length) return;
    const next = [...emails];
    for (const p of parts) {
      if (!next.includes(p)) next.push(p);
    }
    setEmails(next);
    setInputValue("");
  };

  const removeEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", "Tab", ",", ";"].includes(e.key)) {
      e.preventDefault();
      if (inputValue.trim()) addEmail(inputValue);
    } else if (e.key === "Backspace" && !inputValue && emails.length > 0) {
      setEmails(emails.slice(0, -1));
    }
  };

  const handleBlur = () => {
    if (inputValue.trim()) addEmail(inputValue);
  };

  return (
    <div
      className="flex flex-wrap gap-1.5 px-2.5 py-2 min-h-[42px] bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/40 focus-within:border-blue-500 transition-all cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {emails.map((email, i) => {
        const valid = isValidEmail(email);
        return (
          <span
            key={i}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
              valid
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
                : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700"
            }`}
          >
            {email}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeEmail(i); }}
                className="hover:opacity-70 transition-opacity ml-0.5"
                tabIndex={-1}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        );
      })}
      <input
        ref={inputRef}
        id={id}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        disabled={disabled}
        placeholder={emails.length === 0 ? placeholder : ""}
        className="flex-1 min-w-[120px] bg-transparent text-sm text-zinc-900 dark:text-zinc-100 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 disabled:opacity-50 py-0.5"
      />
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────
interface SendInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (to: string, cc: string, subject: string, message: string) => Promise<void>;
  clientEmail: string;
  replyEmail?: string;
  defaultSubject: string;
  defaultMessage: string;
  t: {
    sendInvoice?: string;
    cancel?: string;
    sendingInvoice?: string;
    emailTo?: string;
    emailSubject?: string;
    emailMessage?: string;
  };
}

export function SendInvoiceModal({
  isOpen,
  onClose,
  onSend,
  clientEmail,
  replyEmail = "",
  defaultSubject,
  defaultMessage,
  t,
}: SendInvoiceModalProps) {
  const [toEmails, setToEmails] = useState<string[]>(
    clientEmail ? [clientEmail] : []
  );
  const [ccEmails, setCcEmails] = useState<string[]>(
    replyEmail ? [replyEmail] : []
  );
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(defaultMessage);
  const [isSending, setIsSending] = useState(false);

  // Reset fields when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setToEmails(clientEmail ? [clientEmail] : []);
      setCcEmails(replyEmail ? [replyEmail] : []);
      setSubject(defaultSubject);
      setMessage(defaultMessage);
    }
  }, [isOpen, clientEmail, replyEmail, defaultSubject, defaultMessage]);

  if (!isOpen) return null;

  const allToValid = toEmails.length > 0 && toEmails.every(isValidEmail);
  const allCcValid = ccEmails.every(isValidEmail);
  const canSend = allToValid && allCcValid && subject.trim();

  const handleSend = async () => {
    if (!canSend) return;
    setIsSending(true);
    try {
      await onSend(
        toEmails.join(", "),
        ccEmails.join(", "),
        subject,
        message
      );
    } finally {
      setIsSending(false);
    }
  };

  const hasInvalidTo  = toEmails.some((e) => !isValidEmail(e));
  const hasInvalidCc  = ccEmails.some((e) => !isValidEmail(e));

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={!isSending ? onClose : undefined}
      />

      <div className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-2xl p-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between p-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {t.sendInvoice || "Send Invoice"}
              </h3>
            </div>
            <button
              onClick={onClose}
              disabled={isSending}
              className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">

            {/* From/Reply-To section */}
            {replyEmail && (
              <div className="flex items-center gap-2 px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg border border-zinc-100 dark:border-zinc-800/50">
                <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest shrink-0">From</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                  {replyEmail}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-8 pt-2">
              {/* TO field */}
              <div className="relative">
                <label className="absolute -top-2.5 left-3 px-1.5 bg-white dark:bg-zinc-900 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest z-10 transition-colors">
                  {t.emailTo || "To"}
                </label>
                <EmailChipInput
                  id="send-invoice-to"
                  emails={toEmails}
                  setEmails={setToEmails}
                  disabled={isSending}
                  placeholder="recipient@example.com"
                />
                {hasInvalidTo && (
                  <p className="mt-1 text-xs text-red-500">One or more email addresses are invalid.</p>
                )}
              </div>

              {/* CC field */}
              <div className="relative">
                <label className="absolute -top-2.5 left-3 px-1.5 bg-white dark:bg-zinc-900 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest z-10 transition-colors">
                  CC
                </label>
                <EmailChipInput
                  id="send-invoice-cc"
                  emails={ccEmails}
                  setEmails={setCcEmails}
                  disabled={isSending}
                  placeholder="Optional"
                />
                {hasInvalidCc && (
                  <p className="mt-1 text-xs text-red-500">One or more CC addresses are invalid.</p>
                )}
              </div>
            </div>

            {/* Subject field */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white dark:bg-zinc-900 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest z-10 transition-colors">
                {t.emailSubject || "Subject"}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isSending}
                className="w-full px-3.5 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all disabled:opacity-50"
              />
            </div>

            {/* Message field */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 px-1.5 bg-white dark:bg-zinc-900 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest z-10 transition-colors">
                {t.emailMessage || "Message"}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSending}
                rows={8}
                className="w-full px-4 py-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all resize-none disabled:opacity-50"
              />
            </div>

            {/* Info note */}
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
              Press <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono text-[10px]">Enter</kbd> or <kbd className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono text-[10px]">,</kbd> to add multiple recipients. A view link will be included automatically.
            </p>
          </div>

          {/* Footer */}
          <div className="p-5 pt-3 flex flex-col-reverse sm:flex-row gap-3 justify-end items-center bg-zinc-50 dark:bg-zinc-800/20 border-t border-zinc-100 dark:border-zinc-800">
            <button
              onClick={onClose}
              disabled={isSending}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-medium text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {t.cancel || "Cancel"}
            </button>
            <button
              onClick={handleSend}
              disabled={isSending || !canSend}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/20 disabled:opacity-60 min-w-[140px] cursor-pointer"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.sendingInvoice || "Sending..."}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {t.sendInvoice || "Send Invoice"}
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
