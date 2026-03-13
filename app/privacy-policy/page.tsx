import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read InvoiceQuickly's Privacy Policy to learn how we protect your data, handle public invoice links, and use cookies to provide our free invoice generator.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <main className="container mx-auto px-4 sm:px-8 py-16 max-w-4xl">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Effective Date: March 13, 2026</p>
        </div>

        <div className="space-y-10 prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300">
          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Who We Are
            </h2>
            <p>
              Welcome to InvoiceQuickly ("we," "our," or "us"). We provide a web-based invoice generator accessible at https://invoice-quickly.com. We are committed to protecting your personal information and your right to privacy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Scope of This Policy
            </h2>
            <p>
              This Privacy Policy describes how we collect, use, and share your personal information when you use our website and services, including our free invoice generator, user dashboard, and related features.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Information We Collect
            </h2>
            <p className="mb-4">We collect information that you voluntarily provide to us when you use InvoiceQuickly:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> If you choose to create an account, we collect your email address and authentication credentials.</li>
              <li><strong>Company Details:</strong> Information about the businesses you manage, including company name, email, physical address, phone number, and logo images.</li>
              <li><strong>Client Details:</strong> Information about your clients that you input into invoices, such as their name, email, and address.</li>
              <li><strong>Invoice Details:</strong> Line items, prices, taxes, notes, and digital signature images.</li>
              <li><strong>Billing Information:</strong> If you upgrade to a paid plan, your payment and billing information is collected and processed directly by our payment provider, Paddle. We do not store your full credit card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Information Collected Automatically
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Device and Usage Data:</strong> We collect basic information such as your IP address, browser type, operating system, and how you interact with our website to ensure the service functions correctly.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              How We Use Information
            </h2>
            <p className="mb-4">We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide, operate, and maintain our invoice generator and dashboard.</li>
              <li>To allow you to generate, store, manage, and download PDF invoices.</li>
              <li>To process payments and manage your subscription tier (Free or Pro).</li>
              <li>To communicate with you regarding your account, updates, or support requests.</li>
              <li>To display advertisements to users on our Free plan.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Cookies and Similar Technologies
            </h2>
            <p>
              We and our third-party partners use cookies and similar technologies to ensure our website functions properly, remember your preferences, and serve advertisements. Cookies are small text files stored on your device. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, some parts of our service may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Google AdSense and Advertising Technologies
            </h2>
            <p className="mb-4">
              We use Google AdSense to display advertisements to users on our Free plan. Google and its advertising partners use cookies to serve ads based on your prior visits to our website or other websites on the internet.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to InvoiceQuickly and/or other sites on the Internet.</li>
              <li>You may opt out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Ads Settings</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Third-Party Service Providers
            </h2>
            <p className="mb-4">We rely on trusted third-party services to operate InvoiceQuickly. We share your information only as necessary for them to provide their services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Supabase:</strong> We use Supabase as our backend database and authentication provider. Your invoice and company data is stored securely on their servers.</li>
              <li><strong>Paddle:</strong> We use Paddle as our Merchant of Record to process payments for our Pro plan. Paddle handles your payment information in accordance with their own privacy policy.</li>
              <li><strong>Google AdSense:</strong> Used for serving advertisements (as detailed above).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              How Public Invoice Links Work and Privacy Implications
            </h2>
            <p>
              InvoiceQuickly allows you to share invoices with your clients via a public link (URL). Please be aware that <strong>anyone who possesses this specific public link can view the invoice details associated with it</strong>. We recommend sharing these links only with the intended recipients.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Data Retention
            </h2>
            <p>
              We retain your personal information, including companies and invoices, for as long as your account is active or as needed to provide you with our services. When you delete your account or specific invoices through your dashboard, we will delete or anonymize your data, except where we are required to retain it for legal or tax purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Data Security
            </h2>
            <p>
              We implement industry-standard organizational and technical security measures designed to protect your data. While we strive to protect your personal information, no transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              International Data Transfers
            </h2>
            <p>
              Our servers and third-party service providers (such as Supabase and Paddle) may be located outside of your home country. Your information may be transferred to, stored, and processed in regions with different data protection laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Your Rights and Choices
            </h2>
            <p>
              Depending on your location, you may have the right to access, update, or delete your personal information. You can exercise these rights directly through your InvoiceQuickly dashboard by editing your company details, deleting invoices, or deleting your account. If you need further assistance, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Children's Privacy
            </h2>
            <p>
              InvoiceQuickly is intended for business use and is not directed at children under the age of 16. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any material changes by posting the updated policy on this page with a new "Effective Date."
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-100 dark:border-zinc-800 pb-2">
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at: <br />
              <strong>Email:</strong> <a href="mailto:contact@invoice-quickly.com" className="text-blue-600 hover:underline">contact@invoice-quickly.com</a>
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
