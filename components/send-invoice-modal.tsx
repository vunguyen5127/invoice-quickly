"use client";

import React, { useState } from "react";
import { Send, Loader2, X, Mail } from "lucide-react";

interface SendInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (subject: string, message: string) => Promise<void>;
  clientEmail: string;
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
  defaultSubject,
  defaultMessage,
  t,
}: SendInvoiceModalProps) {
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState(defaultMessage);
  const [isSending, setIsSending] = useState(false);

  // Reset fields when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setSubject(defaultSubject);
      setMessage(defaultMessage);
    }
  }, [isOpen, defaultSubject, defaultMessage]);

  if (!isOpen) return null;

  const handleSend = async () => {
    setIsSending(true);
    try {
      await onSend(subject, message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={!isSending ? onClose : undefined}
      />

      <div className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-lg p-4 animate-in fade-in zoom-in-95 duration-200">
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
          <div className="p-5 space-y-4">
            {/* To field (read-only) */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                {t.emailTo || "To"}
              </label>
              <div className="px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-700 dark:text-zinc-300">
                {clientEmail}
              </div>
            </div>

            {/* Subject field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                {t.emailSubject || "Subject"}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isSending}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all disabled:opacity-50"
              />
            </div>

            {/* Message field */}
            <div>
              <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
                {t.emailMessage || "Message"}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSending}
                rows={5}
                className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all resize-none disabled:opacity-50"
              />
            </div>

            {/* Info note */}
            <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
              A link to view and download the invoice will be included automatically in the email.
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
              disabled={isSending || !subject.trim()}
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
