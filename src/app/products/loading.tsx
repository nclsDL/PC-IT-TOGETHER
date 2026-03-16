export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
      <div className="h-5 w-32 bg-gray-200 rounded mb-6" />
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0 space-y-4">
          <div className="h-6 w-24 bg-gray-200 rounded" />
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-9 bg-gray-100 rounded-lg" />
          ))}
        </aside>
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-72" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
