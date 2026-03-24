import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";
import { marketingPages } from "@/data/marketing-pages";
import { ArrowLeft, ArrowRight, Calendar, Clock, Tag, FileText } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `https://invoice-quickly.com/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Related posts: same category first, then fill with others, max 3
  const sameCat = blogPosts.filter((p) => p.slug !== slug && p.category === post.category);
  const others = blogPosts.filter((p) => p.slug !== slug && p.category !== post.category);
  const relatedPosts = [...sameCat, ...others].slice(0, 3);

  // Related templates: pick 3 marketing pages
  const relatedTemplates = marketingPages.slice(0, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "Invoice-Quickly",
      url: "https://invoice-quickly.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Invoice-Quickly",
      url: "https://invoice-quickly.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://invoice-quickly.com/blog/${slug}`,
    },
  };

  // Simple markdown-like rendering for content sections
  const renderContent = (content: string) => {
    const lines = content.trim().split("\n");
    const elements: React.ReactElement[] = [];
    let listItems: string[] = [];
    let tableRows: string[][] = [];
    let inTable = false;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1.5 text-zinc-600 dark:text-zinc-400 mb-6 pl-2">
            {listItems.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-800 dark:text-zinc-200">$1</strong>') }} />
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        const header = tableRows[0];
        const body = tableRows.slice(1);
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-zinc-100 dark:bg-zinc-800">
                  {header.map((cell, i) => (
                    <th key={i} className="px-4 py-2 text-left font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      {cell.trim().replace(/\*\*/g, "")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {body.map((row, ri) => (
                  <tr key={ri} className="even:bg-zinc-50 dark:even:bg-zinc-800/50">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-4 py-2 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700" dangerouslySetInnerHTML={{ __html: cell.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableRows = [];
        inTable = false;
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();

      // Table detection
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        if (trimmed.replace(/[|\-\s]/g, "").length === 0) continue; // separator row
        flushList();
        inTable = true;
        const cells = trimmed.split("|").filter(Boolean);
        tableRows.push(cells);
        continue;
      } else if (inTable) {
        flushTable();
      }

      if (trimmed.startsWith("## ")) {
        flushList();
        elements.push(
          <h2 key={`h2-${elements.length}`} className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-10 mb-4">
            {trimmed.replace("## ", "")}
          </h2>
        );
      } else if (trimmed.startsWith("> ")) {
        flushList();
        elements.push(
          <blockquote key={`bq-${elements.length}`} className="border-l-4 border-blue-500 pl-4 italic text-zinc-500 dark:text-zinc-400 my-4">
            {trimmed.replace("> ", "").replace(/"/g, '"')}
          </blockquote>
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        listItems.push(trimmed.replace(/^[-*]\s+/, ""));
      } else if (/^\d+\.\s/.test(trimmed)) {
        listItems.push(trimmed.replace(/^\d+\.\s+/, ""));
      } else if (trimmed === "") {
        flushList();
      } else {
        flushList();
        elements.push(
          <p key={`p-${elements.length}`} className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: trimmed
            .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-800 dark:text-zinc-200">$1</strong>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 underline hover:text-blue-700">$1</a>')
          }} />
        );
      }
    }
    flushList();
    flushTable();
    return elements;
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <article className="container max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-4">
              <Tag className="w-3 h-3" />
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
              {post.title}
            </h1>
            <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-5">
              {post.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-zinc-400 dark:text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </header>

          <hr className="border-zinc-200 dark:border-zinc-800 mb-10" />

          {/* Content */}
          <div className="prose-custom">
            {renderContent(post.content)}
          </div>

          {/* CTA */}
          <div className="mt-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-8 text-white text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Ready to Create Your Invoice?</h2>
            <p className="text-blue-100 mb-5">
              Try our free invoice generator — no signup, no watermark.
            </p>
            <Link
              href="/generator"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Create Free Invoice →
            </Link>
          </div>

          {/* Related Articles */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Related Articles</h2>
                <Link href="/blog" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group flex flex-col bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
                  >
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-3 w-fit">
                      <Tag className="w-2.5 h-2.5" />
                      {related.category}
                    </span>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {related.title}
                    </h3>
                    <div className="mt-auto flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500 pt-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {related.readTime}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Templates */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Free Invoice Templates</h2>
              <Link href="/how-to-write-an-invoice" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                All Templates <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedTemplates.map((tmpl) => (
                <Link
                  key={tmpl.slug}
                  href={`/${tmpl.slug}`}
                  className="group flex items-start gap-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">
                      {tmpl.hero.badge.replace("Free ", "")}
                    </p>
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {tmpl.metadata.title.replace(" — ", " – ")}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
