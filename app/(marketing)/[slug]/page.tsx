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

  return <MarketingTemplate page={page} />;
}
