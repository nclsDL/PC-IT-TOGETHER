export default function Loading() {
  return (
    <div className="animate-pulse">
      {/* Hero Skeleton */}
      <div className="bg-gray-100 h-[420px]" />

      {/* Flash Deals Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-7 w-40 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-72" />
          ))}
        </div>
      </div>

      {/* Categories Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-7 w-48 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-gray-200 rounded-xl h-24" />
          ))}
        </div>
      </div>

      {/* Products Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-7 w-52 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-72" />
          ))}
        </div>
      </div>
    </div>
  );
}
