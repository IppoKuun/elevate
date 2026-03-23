function RootSkeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-white/12 ${className}`} />;
}

export default function RootLoading() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(59,130,246,0.18),transparent_30%),radial-gradient(circle_at_82%_28%,rgba(14,165,233,0.16),transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_48%,#020617_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.03)_45%,transparent_70%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 py-12 md:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 rounded-xl border border-white/15 bg-slate-900/40 px-3 py-2 backdrop-blur-sm">
            <div className="h-8 w-8 animate-pulse rounded-md bg-white/15" />
            <span className="text-sm font-semibold tracking-wide text-slate-100">ELEVATE</span>
          </div>

          <RootSkeleton className="mt-8 h-5 w-40 rounded-full" />
          <RootSkeleton className="mt-5 h-14 w-full max-w-2xl" />
          <RootSkeleton className="mt-3 h-14 w-5/6 max-w-xl" />
          <RootSkeleton className="mt-6 h-5 w-full max-w-2xl" />
          <RootSkeleton className="mt-3 h-5 w-4/5 max-w-xl" />

          <div className="mt-10 flex flex-wrap gap-3">
            <RootSkeleton className="h-12 w-40" />
            <RootSkeleton className="h-12 w-36" />
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-slate-900/35 p-3 backdrop-blur-sm"
              >
                <RootSkeleton className="h-3 w-20 rounded-full" />
                <RootSkeleton className="mt-3 h-5 w-full" />
                <RootSkeleton className="mt-2 h-5 w-4/5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
