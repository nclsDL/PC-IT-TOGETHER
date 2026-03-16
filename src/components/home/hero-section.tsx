import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[460px] sm:min-h-[500px]">
      {/* Full-width Banner Image */}
      <Image
        src="/hero-banner.png"
        alt="Gaming PC Setup"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex flex-col justify-center py-16 lg:py-20 max-w-xl">
          <p className="text-brand font-mono text-xs sm:text-sm mb-3 tracking-widest uppercase">
            Welcome to PC-IT-TOGETHER
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-5">
            BUILD YOUR{" "}
            <span className="text-brand">DREAM PC</span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl mb-8 max-w-md">
            Premium components, compatibility checking, and everything you need
            to build the perfect PC — all in one place.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-brand text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-brand-dark transition-colors text-sm"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/build"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors text-sm"
            >
              PC Builder
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
