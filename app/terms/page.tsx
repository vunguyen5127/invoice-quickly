import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Invoice-Quickly",
  description: "Terms of Service for Invoice-Quickly, the free online invoice generator. Read our terms for using the service, subscriptions, and user responsibilities.",
  alternates: { canonical: "https://invoice-quickly.com/terms" },
  openGraph: {
    type: "website",
    title: "Terms of Service | Invoice-Quickly",
    description: "Terms of Service for Invoice-Quickly — the free online invoice generator.",
    url: "https://invoice-quickly.com/terms",
    siteName: "Invoice-Quickly",
  },
};

export default function TermsPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <main className="container mx-auto px-4 sm:px-8 pt-10 pb-16 sm:pt-14 sm:pb-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Last updated: March 10, 2026</p>

        <div className="space-y-8 prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Invoice-Quickly, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our
              service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              2. Description of Service
            </h2>
            <p>Invoice-Quickly is an online invoice generation and management tool. Our payment processing services are provided by <strong>Lemon Squeezy</strong>. By subscribing to our Pro plan, you also agree to be bound by Lemon Squeezy's Terms of Service.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              3. Payments and Subscriptions
            </h2>
            <p className="mb-4">Invoice-Quickly uses Lemon Squeezy as our Merchant of Record for all Pro subscription payments. Lemon Squeezy handles all payment processing, invoicing, and tax collection for these transactions.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Billing Cycle: Paid subscriptions are billed on a recurring basis as selected during checkout.</li>
              <li>Cancellation: You can cancel your subscription at any time through your account dashboard.</li>
              <li>Refunds: Refund requests are handled according to our <a href="/refund-policy" className="text-blue-600 hover:underline">Refund Policy</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              3. User Responsibilities
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You are responsible for the accuracy of the data entered into your invoices.</li>
              <li>You are responsible for maintaining the confidentiality of your account.</li>
              <li>You must not use the service for any illegal or unauthorized purpose.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              4. Intellectual Property
            </h2>
            <p>
              The service and its original content, features, and functionality are owned by Invoice-Quickly and are protected by international copyright,
              trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              5. Limitation of Liability
            </h2>
            <p>
              In no event shall Invoice-Quickly be liable for any indirect, incidental, special, consequential, or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or
              use the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">6. Governing Law</h2>
            <p>These terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">7. Termination</h2>
            <p>
              We may terminate or suspend access to our service immediately, without prior notice or liability, for any reason whatsoever, including without
              limitation if you breach the Terms.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
