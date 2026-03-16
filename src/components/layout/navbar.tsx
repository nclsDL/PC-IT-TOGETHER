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
  Menu,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.getItemCount());
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image src="/logo.png" alt="PC-IT-TOGETHER" width={280} height={70} className="h-14 w-auto" />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 ml-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-brand ${
                  pathname === link.href
                    ? "text-brand border-b-2 border-brand pb-0.5"
                    : "text-gray-700"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex items-center flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for PC parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-4 pr-10 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-3">
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-gray-600 hover:text-brand transition-colors"
            >
              <Heart className="h-5 w-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-brand transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="p-2 text-gray-600 hover:text-brand transition-colors rounded-lg hover:bg-gray-100">
                <User className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {session?.user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium">{session.user.name}</p>
                      <p className="text-xs text-gray-500">{session.user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/wishlist")}>
                      <Heart className="mr-2 h-4 w-4" />
                      Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/cart")}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Cart
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => router.push("/login")}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Log In
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/signup")}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Sign Up
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger className="md:hidden p-2 text-gray-600 hover:text-brand transition-colors rounded-lg hover:bg-gray-100">
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle className="mb-6">
                  <Image src="/logo.png" alt="PC-IT-TOGETHER" width={240} height={60} className="h-12 w-auto" />
                </SheetTitle>
                {/* Mobile Search */}
                <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }} className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for PC parts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full h-10 pl-4 pr-10 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </form>
                <div className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        pathname === link.href
                          ? "bg-brand/10 text-brand"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    href="/build"
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2.5 rounded-lg text-sm font-medium text-brand hover:bg-brand/10"
                  >
                    Build a PC
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
