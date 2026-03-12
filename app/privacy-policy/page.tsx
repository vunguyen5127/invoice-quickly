import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read InvoiceQuickly's privacy policy. Learn how we protect your data when you use our free invoice generator.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Last updated: March 10, 2026</p>

        <div className="space-y-8 prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              1. Information We Collect
            </h2>
            <p className="mb-4">We collect information you provide directly to us when you use our service, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Company details (name, email, address, phone)</li>
              <li>Client details (name, email, address)</li>
              <li>Invoice details (items, prices, taxes)</li>
              <li>Logo and signature images</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">We use the collected information to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Generate and store invoices for your records</li>
              <li>Communicate with you about our service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              3. Data Storage and Security
            </h2>
            <p>
              We use Supabase as our backend provider. Your data is stored securely and is only accessible by you when logged in. We implement industry-standard
              security measures to protect your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              4. Third-Party Services
            </h2>
            <p>
              We do not sell your personal information. We may share data with third-party providers (like hosting and database services) only as necessary to
              provide our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">5. Your Rights</h2>
            <p>You have the right to access, update, or delete your information at any time through your dashboard.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              6. Changes to This Policy
            </h2>
            <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:contact@invoice-quickly.com" className="text-blue-600 hover:underline">
                contact@invoice-quickly.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 bg-zinc-50 dark:bg-zinc-900/50 mt-12">
        <div className="container mx-auto px-4 text-center text-zinc-500 dark:text-zinc-400 text-sm">
          <p>&copy; {new Date().getFullYear()} InvoiceQuickly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
