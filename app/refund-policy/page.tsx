import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund Policy for Invoice-Quickly Pro subscriptions. Learn about our cancellation and refund process.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <main className="container mx-auto px-4 sm:px-8 py-16 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8">Last updated: March 17, 2026</p>

        <div className="space-y-8 prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              1. Free Plan
            </h2>
            <p>
              Invoice-Quickly&apos;s core invoice generator is completely free to use. Since no payment is required for the Free plan, no refund is applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              2. Pro Plan — Cancellation
            </h2>
            <p>
              You may cancel your Pro subscription at any time from your account Settings page. Upon cancellation:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Your Pro features will remain active until the end of your current billing period.</li>
              <li>You will not be charged for the next billing cycle.</li>
              <li>After the billing period ends, your account will automatically revert to the Free plan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              3. Pro Plan — Refunds
            </h2>
            <p>
              We offer a full refund within <strong>14 days</strong> of your initial subscription purchase if you are not satisfied with the Pro plan. To request a refund, please contact us at{" "}
              <a href="mailto:support@invoice-quickly.com" className="text-blue-600 hover:underline">support@invoice-quickly.com</a>.
            </p>
            <p className="mt-3">
              Refunds are <strong>not available</strong> in the following cases:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>More than 14 days have passed since the initial purchase.</li>
              <li>For renewal charges — please cancel before your renewal date to avoid being charged.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              4. How to Request a Refund
            </h2>
            <p>To request a refund, email us at{" "}
              <a href="mailto:support@invoice-quickly.com" className="text-blue-600 hover:underline">support@invoice-quickly.com</a>{" "}
              with your account email and reason for the refund. We will process eligible refunds within 5–10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              5. Contact Us
            </h2>
            <p>
              If you have any questions about our refund policy, please contact us at{" "}
              <a href="mailto:support@invoice-quickly.com" className="text-blue-600 hover:underline">support@invoice-quickly.com</a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
