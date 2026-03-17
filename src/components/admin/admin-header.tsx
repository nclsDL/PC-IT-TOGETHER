"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/new": "New Product",
  "/admin/categories": "Categories",
  "/admin/orders": "Orders",
  "/admin/users": "Users",
  "/admin/coupons": "Coupons",
  "/admin/builds": "Builds",
  "/admin/builds/new": "New Build",
};

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const crumbs: { label: string; href: string }[] = [];

  let path = "";
  for (const segment of segments) {
    path += `/${segment}`;
    const title = pageTitles[path];
    if (title) {
      crumbs.push({ label: title, href: path });
    } else if (segment !== "admin") {
      // Dynamic segment like [id] or "edit"
      const label = segment === "edit" ? "Edit" : segment.slice(0, 8);
      crumbs.push({ label, href: path });
    }
  }

  return crumbs;
}

export function AdminHeader() {
  const pathname = usePathname();
  const crumbs = getBreadcrumbs(pathname);
  const currentTitle = crumbs[crumbs.length - 1]?.label || "Admin";

  return (
    <header className="mb-8">
      {/* Breadcrumbs */}
      {crumbs.length > 1 && (
        <nav className="flex items-center gap-1.5 mb-3">
          {crumbs.map((crumb, i) => (
            <span key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && (
                <ChevronRight className="h-3 w-3 text-dust-grey-300" strokeWidth={1.5} />
              )}
              {i < crumbs.length - 1 ? (
                <Link
                  href={crumb.href}
                  className="text-[12px] text-dust-grey-400 hover:text-dust-grey-600 transition-colors duration-300"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-[12px] text-dust-grey-600 font-medium">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Page Title */}
      <h1 className="text-3xl font-display font-bold tracking-[-0.02em] text-dust-grey-900">
        {currentTitle}
      </h1>
    </header>
  );
}
