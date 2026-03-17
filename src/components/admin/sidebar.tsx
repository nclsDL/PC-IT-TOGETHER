"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Ticket,
  Monitor,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/builds", label: "Builds", icon: Monitor },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <Link href="/admin" onClick={onNavigate}>
          <Image
            src="/logo.png"
            alt="PC-IT-TOGETHER"
            width={160}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
        <p className="mt-2 text-[11px] uppercase tracking-[0.15em] font-medium text-dust-grey-400">
          Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                isActive
                  ? "bg-brand/10 text-brand"
                  : "text-dust-grey-500 hover:text-dust-grey-900 hover:bg-dust-grey-50"
              }`}
            >
              <item.icon
                className={`h-[18px] w-[18px] transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  isActive ? "text-brand" : "text-dust-grey-400 group-hover:text-dust-grey-600"
                }`}
                strokeWidth={1.5}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info + Sign Out */}
      <div className="px-3 pb-6 mt-auto">
        <div className="p-[3px] rounded-2xl bg-black/[0.02] ring-1 ring-black/[0.04]">
          <div className="rounded-[calc(1rem-3px)] bg-white p-4">
            {user && (
              <div className="mb-3">
                <p className="text-[13px] font-semibold text-dust-grey-900 truncate">
                  {user.user_metadata?.name || user.email}
                </p>
                <p className="text-[11px] text-dust-grey-400 truncate">
                  {user.email}
                </p>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] font-medium text-dust-grey-500 hover:text-dust-grey-900 hover:bg-dust-grey-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.5} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-30 w-[280px]">
        <div className="m-3 flex-1 p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
          <div className="h-full rounded-[calc(1.5rem-3px)] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.04)]">
            <SidebarContent />
          </div>
        </div>
      </aside>

      {/* Mobile Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2.5 rounded-xl bg-white ring-1 ring-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-dust-grey-600" strokeWidth={1.5} />
      </button>

      {/* Mobile Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" showCloseButton={false} className="w-[280px] p-0">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-lg text-dust-grey-400 hover:text-dust-grey-600 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
