export default function Loading() {
  return (
    <div className="relative min-h-screen py-12 lg:py-16 px-4 lg:px-6 animate-pulse">
      <div className="bg-neutral-200 rounded-2xl h-48 mb-8" />
      <div className="flex gap-6">
        <div className="hidden lg:block w-64 shrink-0 bg-neutral-100 rounded-2xl h-96" />
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-neutral-100 rounded-2xl h-80" />
          ))}
        </div>
      </div>
    </div>
  );
}
