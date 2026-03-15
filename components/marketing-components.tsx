import React from "react";
import { CheckCircle2 } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, iconColor, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-7 rounded-2xl border border-slate-100 dark:border-zinc-800/80 hover:shadow-xl hover:shadow-slate-900/5 hover:-translate-y-1 transition-all duration-300 group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 ${iconColor}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-zinc-400 leading-relaxed text-sm">{description}</p>
    </div>
  );
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function StepCard({ number, title, description, icon }: StepCardProps) {
  return (
    <div className="relative flex flex-col items-center text-center group">
      <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-5 group-hover:scale-110 transition-transform duration-300 relative z-10">
        {icon}
      </div>
      <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1.5">Step {number}</span>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed max-w-xs">{description}</p>
    </div>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

export function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <details className="group rounded-xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 font-semibold text-slate-900 dark:text-white">
        {question}
        <span className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-300 group-open:rotate-45 transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </span>
      </summary>
      <div className="px-6 pb-5 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
        {answer}
      </div>
    </details>
  );
}

import { Star } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  initials: string;
}

export function TestimonialCard({ quote, name, role, avatar, initials }: TestimonialCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex gap-0.5 mb-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
      <p className="text-slate-700 dark:text-zinc-300 leading-relaxed mb-6 flex-1">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatar} flex items-center justify-center text-white text-sm font-bold shrink-0 ring-2 ring-white dark:ring-zinc-800`}
        >
          {initials}
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white text-sm">{name}</p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">{role}</p>
        </div>
      </div>
    </div>
  );
}
