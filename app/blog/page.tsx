import { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/data/blog-posts";
import { ArrowRight, Calendar, Clock, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog — Invoicing Tips, Guides & Best Practices",
  description: "Learn invoicing best practices, tips for freelancers, and guides to help your business get paid faster. Free resources from Invoice-Quickly.",
  alternates: {
    canonical: "https://invoice-quickly.com/blog",
  },
  openGraph: {
    type: "website",
    title: "Blog — Invoicing Tips, Guides & Best Practices",
    description: "Learn invoicing best practices, tips for freelancers, and guides to help your business get paid faster.",
    url: "https://invoice-quickly.com/blog",
    siteName: "Invoice-Quickly",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Invoicing Tips, Guides & Best Practices",
    description: "Learn invoicing best practices, tips for freelancers, and guides to help your business get paid faster.",
  },
};


export default function BlogIndexPage() {
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Invoice-Quickly Blog",
    description: "Invoicing tips, guides, and best practices for freelancers and small businesses.",
    url: "https://invoice-quickly.com/blog",
    blogPost: blogPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      url: `https://invoice-quickly.com/blog/${post.slug}`,
      author: {
        "@type": "Organization",
        name: "Invoice-Quickly",
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        {/* Hero */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20" />
          <div className="container relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-6">
              📚 Invoice-Quickly Blog
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
              Invoicing Tips, Guides &{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                Best Practices
              </span>
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Everything you need to know about creating professional invoices, getting paid faster, and managing your business finances.
            </p>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="container max-w-5xl mx-auto px-4 sm:px-6 pb-20">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
              >
                {/* Category Badge */}
                <div className="px-6 pt-6">
                  <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    <Tag className="w-3 h-3" />
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 px-6 py-4">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">
                    {post.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="px-6 pb-5 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container max-w-3xl mx-auto px-4 sm:px-6 pb-20 text-center">
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 p-8 sm:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to Create Your Invoice?</h2>
            <p className="text-blue-100 mb-6 max-w-lg mx-auto">
              Put these tips into practice. Create a professional invoice in under 60 seconds — free, no signup required.
            </p>
            <Link
              href="/generator"
              className="inline-flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              Create Free Invoice
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
