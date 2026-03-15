import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
      <ol className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-zinc-400">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 px-1 py-1 rounded-md hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all font-medium"
            aria-label="Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
            {item.href ? (
              <Link
                href={item.href}
                className="px-1 py-1 rounded-md hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all font-medium"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-slate-900 dark:text-white px-1 py-1">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
