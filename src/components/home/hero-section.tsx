import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const heroProducts = [
  { src: "/products/gpus/rtx-4080-super.png", alt: "RTX 4080 Super" },
  { src: "/products/cpus/ryzen-7-7800x3d.png", alt: "Ryzen 7 7800X3D" },
  { src: "/products/cases/nzxt-h5-flow.png", alt: "NZXT H5 Flow" },
  { src: "/products/ram/gskill-trident-z5-32gb.png", alt: "G.Skill Trident Z5" },
  { src: "/products/motherboards/asus-b650e-f.png", alt: "ASUS B650E-F" },
];

export function HeroSection() {
  return (
    <section className="py-28 lg:py-36">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* Left Content — Editorial Split */}
          <div className="flex-1 max-w-[620px]">
            {/* Eyebrow */}
            <span className="inline-block rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-medium bg-brand/10 text-brand mb-8">
              Premium PC Components
            </span>

            <h1 className="font-display text-[40px] sm:text-[56px] lg:text-[72px] font-bold text-dust-grey-900 leading-[0.95] tracking-[-0.02em] mb-7">
              FIND THE PERFECT DEVICE FOR YOUR SETUP
            </h1>
            <p className="text-lg text-dust-grey-500 leading-[1.7] max-w-[480px] mb-10">
              Browse through our meticulously selected PC components, designed to power your dream build and cater to every performance need.
            </p>

            {/* CTA — Button-in-Button */}
            <Link
              href="/products"
              className="group inline-flex items-center bg-brand text-white font-medium text-[15px] pl-7 pr-2 py-2 rounded-full hover:bg-brand-dark active:scale-[0.98] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
            >
              Shop Now
              <span className="ml-3 w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" strokeWidth={2} />
              </span>
            </Link>

            {/* Stats — Double Bezel Cards */}
            <div className="flex items-center gap-4 mt-16">
              {[
                { value: "200+", label: "Top Brands" },
                { value: "2,000+", label: "Quality Products" },
                { value: "30,000+", label: "Happy Customers" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-[3px] rounded-2xl bg-black/[0.02] ring-1 ring-black/[0.04]"
                >
                  <div className="bg-white rounded-[calc(1rem-3px)] px-5 py-4">
                    <p className="font-bold text-[28px] lg:text-[32px] text-dust-grey-900 leading-none tracking-[-0.02em]">{stat.value}</p>
                    <p className="text-sm text-dust-grey-400 mt-1">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Product Grid with Double Bezel */}
          <div className="flex-1 hidden md:block">
            <div className="flex flex-col gap-3.5 max-w-[500px] ml-auto">
              {/* Hero product — large */}
              <div className="p-[3px] rounded-[2rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
                <div className="bg-white rounded-[calc(2rem-3px)] p-10 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
                  <Image
                    src={heroProducts[0].src}
                    alt={heroProducts[0].alt}
                    width={360}
                    height={240}
                    className="object-contain max-h-[200px] w-auto"
                    priority
                  />
                </div>
              </div>
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-3.5">
                {heroProducts.slice(1, 3).map((product) => (
                  <div key={product.alt} className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
                    <div className="bg-white rounded-[calc(1.5rem-3px)] p-6 flex items-center justify-center aspect-square shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
                      <Image
                        src={product.src}
                        alt={product.alt}
                        width={160}
                        height={160}
                        className="object-contain max-h-[110px] w-auto"
                      />
                    </div>
                  </div>
                ))}
              </div>
              {/* Row 2 */}
              <div className="grid grid-cols-2 gap-3.5">
                {heroProducts.slice(3).map((product) => (
                  <div key={product.alt} className="p-[3px] rounded-[1.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
                    <div className="bg-white rounded-[calc(1.5rem-3px)] p-6 flex items-center justify-center aspect-square shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
                      <Image
                        src={product.src}
                        alt={product.alt}
                        width={160}
                        height={160}
                        className="object-contain max-h-[110px] w-auto"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
