import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Subscribe */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image src="/logo.png" alt="PC-IT-TOGETHER" width={240} height={60} className="h-14 w-auto brightness-0 invert" />
            </Link>
            <p className="text-sm text-gray-400 mb-2">Subscribe</p>
            <p className="text-xs text-gray-400 mb-3">Get 10% off your first order</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-transparent border border-gray-600 rounded-l-md px-3 py-2 text-sm focus:outline-none focus:border-brand"
              />
              <button className="bg-transparent border border-l-0 border-gray-600 rounded-r-md px-3 hover:bg-brand hover:border-brand transition-colors">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Manila, Philippines</li>
              <li>support@pcittogether.com</li>
              <li>+63 912-345-6789</li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/login" className="hover:text-brand transition-colors">My Account</Link></li>
              <li><Link href="/login" className="hover:text-brand transition-colors">Login / Register</Link></li>
              <li><Link href="/cart" className="hover:text-brand transition-colors">Cart</Link></li>
              <li><Link href="/wishlist" className="hover:text-brand transition-colors">Wishlist</Link></li>
              <li><Link href="/products" className="hover:text-brand transition-colors">Shop</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="#" className="hover:text-brand transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-brand transition-colors">Terms of Use</Link></li>
              <li><Link href="#" className="hover:text-brand transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-brand transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Why PC-IT-TOGETHER? */}
          <div>
            <h3 className="font-semibold mb-4">Why PC-IT-TOGETHER?</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Real-time compatibility checking</li>
              <li>Curated PC components</li>
              <li>Easy PC builder tool</li>
              <li>Secure PayPal checkout</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Social Icons & Copyright */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-sm text-gray-500 text-center">
            © Copyright PC-IT-TOGETHER 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
