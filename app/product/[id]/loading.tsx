export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse">
      <div className="h-16 bg-neutral-100 border-b border-neutral-200 mb-8" />
      <div className="px-4 lg:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-6 bg-neutral-100 rounded-3xl aspect-square" />
        <div className="lg:col-span-6 space-y-4">
          <div className="h-6 w-24 bg-neutral-200 rounded-full" />
          <div className="h-12 bg-neutral-200 rounded-xl" />
          <div className="h-8 w-32 bg-neutral-200 rounded-xl" />
          <div className="h-24 bg-neutral-100 rounded-2xl" />
          <div className="h-14 bg-neutral-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
