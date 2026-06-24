export default function Loading() {
  return (
    <div className="relative min-h-screen py-12 lg:py-16 px-4 lg:px-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-neutral-100 rounded-2xl h-72" />
        ))}
      </div>
    </div>
  );
}
