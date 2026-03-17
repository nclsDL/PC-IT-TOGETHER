export function BrandBar() {
  const brands = ["NVIDIA", "AMD", "INTEL", "CORSAIR", "ASUS"];

  return (
    <div className="relative py-8 bg-hunter-green-800">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8 overflow-x-auto">
        {brands.map((brand) => (
          <span
            key={brand}
            className="text-white/60 font-display text-[22px] lg:text-[28px] font-bold whitespace-nowrap tracking-[0.05em] hover:text-white/90 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
