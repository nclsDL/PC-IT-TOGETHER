import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-3 text-base">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          {i > 0 && <ChevronRight className="h-4 w-4 text-black/60" />}
          {item.href ? (
            <Link href={item.href} className="text-black/60 hover:text-black transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-black">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
