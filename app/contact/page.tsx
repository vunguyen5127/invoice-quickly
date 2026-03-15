import type { Metadata } from "next";
import ContactContent from "./contact-content";

export const metadata: Metadata = {
  title: "Get in Touch | Contact Invoice-Quickly",
  description:
    "Have questions, feedback, or need support? Contact the Invoice-Quickly team. We're here to help you get the most out of our free invoice generator.",
  alternates: {
    canonical: "https://invoice-quickly.com/contact",
  },
};

export default function ContactPage() {
  return <ContactContent />;
}
