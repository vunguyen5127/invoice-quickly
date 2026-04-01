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
        <section className="relative overflow-hidden pt-10 pb-20 sm:pt-16 sm:pb-28">
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent dark:from-blue-900/20" />
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -right-24 w-72 h-72 bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-3xl" />
          
          <div className="container relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3.5 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-6 border border-blue-200 dark:border-blue-800/50 shadow-sm">
              📚 Educational Hub
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
              Invoicing Tips &{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Expert Guides
              </span>
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Master the art of professional billing. Learn how to get paid faster, manage clients, and grow your freelance business with our expert advice.
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
                className="group flex flex-col bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)] hover:border-blue-500/30 dark:hover:border-blue-500/20 hover:-translate-y-1.5 transition-all duration-300 ease-out"
              >
                {/* Category & Category Badge */}
                <div className="px-6 pt-6 flex justify-between items-center">
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/20 px-2.5 py-1 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest border border-blue-100/50 dark:border-blue-800/30">
                    {post.category}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                     <Tag className="w-3.5 h-3.5" />
                  </div>
                </div>
 
                {/* Content */}
                <div className="flex-1 px-6 py-5">
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                    {post.description}
                  </p>
                </div>
 
                {/* Footer */}
                <div className="px-6 pb-6 pt-2 mt-auto border-t border-zinc-50 dark:border-zinc-900/50 flex items-center justify-between text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-zinc-400" />
                      {post.readTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1">
                    <span>Read</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
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
