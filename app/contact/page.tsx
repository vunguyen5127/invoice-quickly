"use client";

import Link from "next/link";
import { Mail, MessageSquare, Clock, ArrowRight, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [copied, setCopied] = useState(false);
  const email = "contact@invoice-quickly.com";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      <main className="container mx-auto px-4 sm:px-8 py-20 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6">Get in Touch</h1>
          <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Have questions, feedback, or need support? We're here to help you get the most out of Invoice-Quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Email Card */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center group hover:border-blue-500/30 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">The best way to reach us for any inquiries.</p>
            
            <div className="w-full flex flex-col items-center gap-3">
              <a 
                href={`mailto:${email}`} 
                className="text-blue-600 font-bold hover:underline text-lg whitespace-nowrap"
                title="Send an email"
              >
                {email}
              </a>
              <button 
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-500" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Response Time Card */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center group hover:border-emerald-500/30 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Clock className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Response Time</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">We're fast! Expect a reply within:</p>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold text-2xl">24 Hours</span>
            <p className="text-xs text-zinc-400 mt-2">Monday — Friday</p>
          </div>

          {/* Custom Support Card */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center text-center group hover:border-purple-500/30 transition-all">
            <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Feedback</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">We love hearing from our users about new features.</p>
            <button className="w-full py-3 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white rounded-xl font-bold hover:opacity-90 transition-opacity">
              Send Feedback
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 pt-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-10">
              Check out our <Link href="/#faq" className="text-blue-600 hover:underline">FAQ section</Link> for quick answers to common questions about invoicing, security, and more.
            </p>
            <Link
              href="/#features"
              className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 font-bold hover:text-blue-600 transition-colors"
            >
              Explore all features
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="container mx-auto px-4 text-center text-zinc-500 dark:text-zinc-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Invoice-Quickly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
