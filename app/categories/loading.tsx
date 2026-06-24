export default function Loading() {
  return (
    <div className="relative min-h-screen py-12 lg:py-16 px-4 lg:px-6 animate-pulse">
      <div className="bg-neutral-200 rounded-2xl h-48 mb-12" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="bg-neutral-100 rounded-2xl h-56" />
        ))}
      </div>
    </div>
  );
}
