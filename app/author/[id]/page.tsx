import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authors } from "@/data/authors";
import { blogPosts } from "@/data/blog-posts";
import { ArrowLeft, Clock, Tag, ExternalLink } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return Object.keys(authors).map((id) => ({
    id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const author = authors[id];

  if (!author) return {};

  return {
    title: `${author.name} — Author Profile | Invoice-Quickly`,
    description: author.bio,
    alternates: {
      canonical: `https://invoice-quickly.com/author/${id}`,
    },
    openGraph: {
      type: "profile",
      title: `${author.name} — Author Profile`,
      description: author.bio,
      url: `https://invoice-quickly.com/author/${id}`,
      siteName: "Invoice-Quickly",
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { id } = await params;
  const author = authors[id];

  if (!author) {
    notFound();
  }

  const authorPosts = blogPosts.filter((post) => post.authorId === id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-12"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Author Header */}
        <header className="flex flex-col md:flex-row gap-8 items-start mb-16 pb-12 border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 shadow-xl relative shrink-0">
            {author.avatarUrl ? (
              <Image src={author.avatarUrl} alt={author.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-zinc-400 font-bold">
                {author.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-锌-100 mb-2">
              {author.name}
            </h1>
            <p className="text-xl font-medium text-blue-600 dark:text-blue-400 mb-4">
              {author.role}
            </p>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 max-w-2xl">
              {author.bio}
            </p>
            {author.socials && (
              <div className="flex items-center gap-4">
                {author.socials.linkedin && (
                  <a href={author.socials.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors">
                    LinkedIn <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                {author.socials.twitter && (
                  <a href={author.socials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-colors">
                    Twitter <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Author Posts */}
        <section>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-8">
            Articles by {author.name}
          </h2>
          {authorPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {authorPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-400 dark:hover:border-blue-600 transition-all hover:shadow-lg"
                >
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 w-fit">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3 mb-6 flex-1">
                      {post.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                      <span>•</span>
                      <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 dark:text-zinc-400">No articles published yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
