export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="h-[480px] bg-neutral-200 mb-6" />
      <div className="px-4 lg:px-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-neutral-100 rounded-2xl h-72" />
          ))}
        </div>
      </div>
    </div>
  );
}
