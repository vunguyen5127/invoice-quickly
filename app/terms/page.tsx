import Link from "next/link";
import { Receipt, ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-[#f6f6f6] dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <img src="/logo.png" alt="InvoiceQuickly Logo" className="h-8 w-8 object-contain" />
            <span>InvoiceQuickly</span>
          </Link>
          <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Last updated: March 10, 2026</p>

        <div className="space-y-8 prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using InvoiceQuickly, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">2. Description of Service</h2>
            <p>
              InvoiceQuickly is an online invoice generation and management tool. We provide features to create, save, and download professional invoices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for the accuracy of the data entered into your invoices.</li>
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>You must not use the service for any illegal or unauthorized purpose.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">4. Intellectual Property</h2>
            <p>
              The service and its original content, features, and functionality are owned by InvoiceQuickly and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">5. Limitation of Liability</h2>
            <p>
              In no event shall InvoiceQuickly be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">6. Governing Law</h2>
            <p>
              These terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">7. Termination</h2>
            <p>
              We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12 bg-zinc-50 dark:bg-zinc-900/50 mt-12">
        <div className="container mx-auto px-4 text-center text-zinc-500 dark:text-zinc-400 text-sm">
          <p>&copy; 2026 InvoiceQuickly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
