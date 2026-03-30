import { Metadata } from "next";
import { notFound } from "next/navigation";
import { marketingPages } from "@/data/marketing-pages";
import { MarketingTemplate } from "@/components/marketing-template";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return marketingPages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = marketingPages.find((p) => p.slug === slug);

  if (!page) return {};

  const canonicalUrl = `https://invoice-quickly.com/${slug}`;

  return {
    title: page.metadata.title,
    description: page.metadata.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      title: page.metadata.title,
      description: page.metadata.description,
      url: canonicalUrl,
      siteName: "Invoice-Quickly",
    },
    twitter: {
      card: "summary_large_image",
      title: page.metadata.title,
      description: page.metadata.description,
    },
  };
}

export default async function MarketingPage({ params }: Props) {
  const { slug } = await params;
  const page = marketingPages.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

  const canonicalUrl = `https://invoice-quickly.com/${slug}`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.metadata.title,
    description: page.metadata.description,
    url: canonicalUrl,
    publisher: {
      "@type": "Organization",
      name: "Invoice-Quickly",
      url: "https://invoice-quickly.com",
    },
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://invoice-quickly.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Templates",
        "item": "https://invoice-quickly.com/how-to-write-an-invoice"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": page.hero.badge.replace("Free ", ""),
        "item": canonicalUrl
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <MarketingTemplate page={page} />
    </>
  );
}
