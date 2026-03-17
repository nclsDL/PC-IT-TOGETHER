import Link from "next/link";
import { Cpu, Monitor, CircuitBoard, MemoryStick, HardDrive, Box, Zap, Fan, ArrowUpRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

const categoryIcons: Record<string, React.ReactNode> = {
  cpus: <Cpu className="h-10 w-10" strokeWidth={1.2} />,
  gpus: <Monitor className="h-10 w-10" strokeWidth={1.2} />,
  motherboards: <CircuitBoard className="h-10 w-10" strokeWidth={1.2} />,
  ram: <MemoryStick className="h-10 w-10" strokeWidth={1.2} />,
  storage: <HardDrive className="h-10 w-10" strokeWidth={1.2} />,
  cases: <Box className="h-10 w-10" strokeWidth={1.2} />,
  psus: <Zap className="h-10 w-10" strokeWidth={1.2} />,
  coolers: <Fan className="h-10 w-10" strokeWidth={1.2} />,
};

export function BrowseByCategory({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Double Bezel — Large Container */}
        <div className="p-[4px] rounded-[2.5rem] bg-black/[0.02] ring-1 ring-black/[0.04]">
          <div className="bg-surface rounded-[calc(2.5rem-4px)] px-8 sm:px-16 py-20">
            <div className="text-center mb-16">
              <span className="inline-block rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] font-medium bg-brand/10 text-brand mb-5">
                Components
              </span>
              <h2 className="font-display text-[40px] lg:text-[52px] font-bold text-dust-grey-900 tracking-[-0.02em]">
                BROWSE BY CATEGORY
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group relative p-[3px] rounded-[1.25rem] bg-black/[0.02] ring-1 ring-black/[0.04] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
                >
                  <div className="bg-white rounded-[calc(1.25rem-3px)] p-6 flex flex-col gap-4 min-h-[140px] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                    <div className="text-dust-grey-300 group-hover:text-brand transition-colors duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      {categoryIcons[cat.slug] || <Box className="h-10 w-10" strokeWidth={1.2} />}
                    </div>
                    <div className="flex items-end justify-between mt-auto">
                      <h3 className="font-semibold text-base text-dust-grey-900">
                        {cat.name}
                      </h3>
                      <ArrowUpRight className="h-4 w-4 text-dust-grey-300 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" strokeWidth={1.5} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
