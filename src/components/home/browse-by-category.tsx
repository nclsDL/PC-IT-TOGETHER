import Link from "next/link";
import { Cpu, Monitor, CircuitBoard, MemoryStick, HardDrive, Box, Zap, Server } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
}

const categoryIcons: Record<string, React.ReactNode> = {
  cpus: <Cpu className="h-8 w-8" />,
  gpus: <Monitor className="h-8 w-8" />,
  motherboards: <CircuitBoard className="h-8 w-8" />,
  ram: <MemoryStick className="h-8 w-8" />,
  storage: <HardDrive className="h-8 w-8" />,
  cases: <Box className="h-8 w-8" />,
  psus: <Zap className="h-8 w-8" />,
  "pre-built": <Server className="h-8 w-8" />,
  coolers: <Zap className="h-8 w-8" />,
};

export function BrowseByCategory({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-brand rounded p-1">
            <CircuitBoard className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Browse By Category</h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-brand hover:shadow-md transition-all group"
            >
              <div className="text-gray-500 group-hover:text-brand transition-colors">
                {categoryIcons[cat.slug] || <Box className="h-8 w-8" />}
              </div>
              <span className="text-xs font-medium text-gray-700 text-center group-hover:text-brand transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
