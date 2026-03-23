function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} />;
}

export default function PublicLoading() {
  return (
    <section className="min-h-[calc(100vh-12rem)] bg-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 md:px-8">
        <div className="max-w-3xl">
          <SkeletonBlock className="h-4 w-32 rounded-full" />
          <SkeletonBlock className="mt-4 h-10 w-72" />
          <SkeletonBlock className="mt-3 h-5 w-full max-w-2xl" />
          <SkeletonBlock className="mt-2 h-5 w-4/5 max-w-xl" />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">
            <SkeletonBlock className="h-12 flex-1" />
            <SkeletonBlock className="h-12 md:w-32" />
            <SkeletonBlock className="h-12 md:w-32" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <SkeletonBlock className="h-52 w-full rounded-none" />
              <div className="space-y-4 p-5">
                <SkeletonBlock className="h-6 w-3/4" />
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-5/6" />
                <div className="flex items-center justify-between pt-2">
                  <SkeletonBlock className="h-5 w-20" />
                  <SkeletonBlock className="h-10 w-32" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
