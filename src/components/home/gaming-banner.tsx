import Image from "next/image";
import Link from "next/link";

const highlights = [
  { name: "Graphics Cards", image: "/products/gpus/rtx-4070-ti-super.png", href: "/products?category=gpus" },
  { name: "Processors", image: "/products/cpus/ryzen-7-7800x3d.png", href: "/products?category=cpus" },
  { name: "Motherboards", image: "/products/motherboards/asus-b650e-f.png", href: "/products?category=motherboards" },
  { name: "Memory", image: "/products/ram/gskill-trident-z5-32gb.png", href: "/products?category=ram" },
  { name: "Storage", image: "/products/storage/samsung-990-pro-1tb.png", href: "/products?category=storage" },
];

export function GamingBanner() {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,185,0,0.1),transparent_70%)]" />
          <div className="relative px-8 md:px-12 pt-10 pb-8">
            <h2 className="text-white text-3xl sm:text-4xl font-bold text-center mb-2">
              Enhance Your Gaming Experience
            </h2>
            <p className="text-gray-400 text-center text-sm mb-8 max-w-lg mx-auto">
              Premium components, expert picks, and unbeatable deals for every gamer.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {highlights.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 text-center transition-all hover:scale-[1.03]"
                >
                  <div className="h-24 flex items-center justify-center mb-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="object-contain h-full w-auto group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <p className="text-white text-xs font-medium">{item.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
