import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer>
      {/* Newsletter CTA — Double Bezel */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-[3px] rounded-[2rem] ring-1 ring-white/10 -mb-[88px] relative z-10">
          <div className="bg-hunter-green-800 rounded-[calc(2rem-3px)] px-8 sm:px-16 py-12 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <h2 className="font-display text-[32px] lg:text-[42px] font-bold text-white leading-[1.05] max-w-[550px] tracking-[-0.02em]">
              STAY UP TO DATE ABOUT OUR LATEST OFFERS
            </h2>
            <div className="flex flex-col gap-3.5 w-full max-w-[360px]">
              <div className="p-[2px] rounded-full bg-white/10 ring-1 ring-white/10">
                <div className="bg-white rounded-full flex items-center gap-3 px-5 py-3">
                  <Mail className="h-5 w-5 text-dust-grey-300 shrink-0" strokeWidth={1.5} />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 text-[15px] bg-transparent outline-none placeholder:text-dust-grey-300"
                  />
                </div>
              </div>
              <button className="group bg-white text-dust-grey-900 font-medium text-[15px] rounded-full py-3.5 px-6 flex items-center justify-center gap-2 hover:bg-dust-grey-50 active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                Subscribe to Newsletter
                <ArrowRight className="h-4 w-4 opacity-40 group-hover:translate-x-0.5 group-hover:opacity-70 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Content */}
      <div className="bg-surface pt-[130px] pb-14">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-14 lg:gap-0 lg:justify-between">
            {/* Brand */}
            <div className="max-w-[260px]">
              <Link href="/" className="block mb-6">
                <Image src="/logo.png" alt="PC-IT-TOGETHER" width={160} height={40} className="h-10 w-auto" />
              </Link>
              <p className="text-[15px] text-dust-grey-500 leading-[1.7] mb-8">
                We have the best PC components for your dream build. From budget to enthusiast, every part you need.
              </p>
              <div className="flex items-center gap-2.5">
                {["X", "f", "ig", "gh"].map((label) => (
                  <a
                    key={label}
                    href="#"
                    className="w-8 h-8 rounded-full bg-black/[0.04] ring-1 ring-black/[0.04] flex items-center justify-center text-[11px] font-semibold text-dust-grey-500 hover:bg-brand hover:text-white hover:ring-brand active:scale-[0.95] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-16">
              {[
                {
                  title: "Company",
                  links: [
                    { label: "About", href: "/about" },
                    { label: "Products", href: "/products" },
                    { label: "PC Builder", href: "/build" },
                    { label: "Contact", href: "/contact" },
                  ],
                },
                {
                  title: "Help",
                  links: [
                    { label: "Customer Support", href: "/contact" },
                    { label: "Delivery Details", href: "#" },
                    { label: "Terms & Conditions", href: "#" },
                    { label: "Privacy Policy", href: "#" },
                  ],
                },
                {
                  title: "FAQ",
                  links: [
                    { label: "Account", href: "/login" },
                    { label: "Manage Deliveries", href: "#" },
                    { label: "Orders", href: "#" },
                    { label: "Payments", href: "#" },
                  ],
                },
                {
                  title: "Resources",
                  links: [
                    { label: "PC Builder Guide", href: "/build" },
                    { label: "Build Tutorials", href: "#" },
                    { label: "How to - Blog", href: "#" },
                    { label: "YouTube Channel", href: "#" },
                  ],
                },
              ].map((section) => (
                <div key={section.title}>
                  <h3 className="font-medium text-dust-grey-900 text-[13px] tracking-[0.15em] uppercase mb-7">
                    {section.title}
                  </h3>
                  <ul className="space-y-4">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-[15px] text-dust-grey-500 hover:text-dust-grey-900 transition-colors duration-300"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="h-px bg-gradient-to-r from-transparent via-dust-grey-200 to-transparent mt-14 mb-7" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-dust-grey-400">
              PC-IT-TOGETHER &copy; 2024-2025, All Rights Reserved
            </p>
            <div className="flex items-center gap-2.5">
              {[
                { label: "VISA", color: "text-[#1434CB]" },
                { label: "MC", color: "text-[#EB001B]" },
                { label: "PayPal", color: "text-[#179BD7]" },
                { label: "GPay", color: "text-dust-grey-600" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className={`h-[30px] px-3 bg-white rounded-lg flex items-center justify-center ring-1 ring-black/[0.04] text-[10px] font-bold ${badge.color}`}
                >
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
