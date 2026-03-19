"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Heart,
  ShoppingCart,
  User,
  Search,
  LogOut,
  LogIn,
  UserPlus,
  Package,
  ChevronDown,
  ArrowUpRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { href: "/products", label: "Shop", hasDropdown: true },
  { href: "/products?sale=true", label: "On Sale" },
  { href: "/products?new=true", label: "New Arrivals" },
  { href: "/build", label: "PC Builder" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getItemCount());
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-40 pt-4 pb-2 px-4">
        <nav className="max-w-[1280px] mx-auto backdrop-blur-xl bg-white/70 ring-1 ring-black/[0.04] shadow-[0_2px_24px_rgba(0,0,0,0.04)] rounded-[2rem] px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-6">
            {/* Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden relative w-6 h-5 flex flex-col justify-between"
              aria-label="Toggle menu"
            >
              <span className={`block h-[1.5px] w-full bg-dust-grey-900 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-center ${mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
              <span className={`block h-[1.5px] w-full bg-dust-grey-900 rounded-full transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileMenuOpen ? "opacity-0 scale-x-0" : ""}`} />
              <span className={`block h-[1.5px] w-full bg-dust-grey-900 rounded-full transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] origin-center ${mobileMenuOpen ? "-rotate-45 -translate-y-[9px]" : ""}`} />
            </button>

            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Image src="/logo.png" alt="PC-IT-TOGETHER" width={180} height={45} className="h-9 lg:h-11 w-auto" priority />
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1 text-[15px] tracking-[-0.01em] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] whitespace-nowrap ${
                    pathname === link.href || (link.href === "/products" && pathname?.startsWith("/products"))
                      ? "text-brand font-medium"
                      : "text-dust-grey-600 hover:text-dust-grey-900"
                  }`}
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5 opacity-50" />}
                </Link>
              ))}
            </div>

            {/* Search Bar — Double Bezel */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center flex-1 max-w-md"
            >
              <div className="w-full p-[3px] rounded-full bg-black/[0.03] ring-1 ring-black/[0.04]">
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-dust-grey-400" strokeWidth={1.5} />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-10 pl-11 pr-4 rounded-full bg-white text-[15px] placeholder:text-dust-grey-300 focus:outline-none"
                  />
                </div>
              </div>
            </form>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              {/* Mobile Search */}
              <button
                className="lg:hidden p-2.5 rounded-full text-dust-grey-600 hover:bg-black/[0.03] transition-colors duration-300"
                onClick={() => router.push("/products")}
                aria-label="Search"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 rounded-full text-dust-grey-600 hover:bg-black/[0.03] transition-colors duration-300"
              >
                <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                {mounted && cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 bg-brand text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white/70">
                    {cartItemCount > 99 ? "99+" : cartItemCount}
                  </span>
                )}
              </Link>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2.5 rounded-full text-dust-grey-600 hover:bg-black/[0.03] transition-colors duration-300 hidden sm:flex"
              >
                <Heart className="h-5 w-5" strokeWidth={1.5} />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-brand text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center ring-2 ring-white/70">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger className="p-2.5 rounded-full text-dust-grey-600 hover:bg-black/[0.03] transition-colors duration-300">
                  <User className="h-5 w-5" strokeWidth={1.5} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-2xl p-1.5 shadow-[0_8px_40px_rgba(0,0,0,0.08)] border-black/[0.04]">
                  {user ? (
                    <>
                      <div className="px-3 py-2.5">
                        <p className="text-sm font-semibold text-dust-grey-900">{user.user_metadata?.name || user.email}</p>
                        <p className="text-xs text-dust-grey-400">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push("/wishlist")} className="rounded-xl">
                        <Heart className="mr-2 h-4 w-4" strokeWidth={1.5} />
                        Wishlist
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/cart")} className="rounded-xl">
                        <ShoppingCart className="mr-2 h-4 w-4" strokeWidth={1.5} />
                        Cart
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/orders")} className="rounded-xl">
                        <Package className="mr-2 h-4 w-4" strokeWidth={1.5} />
                        Orders
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={async () => { const supabase = createClient(); await supabase.auth.signOut(); router.refresh(); }} className="rounded-xl">
                        <LogOut className="mr-2 h-4 w-4" strokeWidth={1.5} />
                        Sign Out
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => router.push("/login")} className="rounded-xl">
                        <LogIn className="mr-2 h-4 w-4" strokeWidth={1.5} />
                        Log In
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/signup")} className="rounded-xl">
                        <UserPlus className="mr-2 h-4 w-4" strokeWidth={1.5} />
                        Sign Up
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </div>

      {/* Full-Screen Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-30 backdrop-blur-3xl bg-white/85 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col justify-center items-center h-full gap-3 px-8">
          {/* Search */}
          <form onSubmit={handleSearch} className="w-full max-w-sm mb-8">
            <div className="p-[3px] rounded-full bg-black/[0.03] ring-1 ring-black/[0.04]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-dust-grey-400" strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-full bg-white text-base placeholder:text-dust-grey-300 focus:outline-none"
                />
              </div>
            </div>
          </form>

          {/* Staggered Nav Links */}
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-[32px] font-display font-bold tracking-[-0.02em] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                mobileMenuOpen
                  ? "translate-y-0 opacity-100 blur-0"
                  : "translate-y-12 opacity-0 blur-sm"
              } ${
                pathname === link.href ? "text-brand" : "text-dust-grey-900 hover:text-brand"
              }`}
              style={{ transitionDelay: mobileMenuOpen ? `${100 + i * 60}ms` : "0ms" }}
            >
              <span className="flex items-center gap-3">
                {link.label}
                <ArrowUpRight className="h-6 w-6 opacity-30" strokeWidth={1.5} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
