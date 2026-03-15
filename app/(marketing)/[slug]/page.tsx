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

  return {
    title: page.metadata.title,
    description: page.metadata.description,
    alternates: {
      canonical: `https://invoice-quickly.com/${slug}`,
    },
  };
}

export default async function MarketingPage({ params }: Props) {
  const { slug } = await params;
  const page = marketingPages.find((p) => p.slug === slug);

  if (!page) {
    notFound();
  }

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
        "item": `https://invoice-quickly.com/${slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <MarketingTemplate page={page} />
    </>
  );
}
