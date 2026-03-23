function AdminSkeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} />;
}

export default function AdminLoading() {
  return (
    <section className="min-h-full bg-slate-50 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-[linear-gradient(135deg,#f8fafc_0%,#dbeafe_52%,#cffafe_100%)] px-6 py-8 md:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="w-full max-w-3xl">
                <AdminSkeleton className="h-6 w-32 rounded-full" />
                <AdminSkeleton className="mt-4 h-10 w-72" />
                <AdminSkeleton className="mt-3 h-5 w-full max-w-2xl" />
                <AdminSkeleton className="mt-2 h-5 w-3/4 max-w-xl" />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <AdminSkeleton className="h-20 w-full min-w-44" />
                <AdminSkeleton className="h-20 w-full min-w-44" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <AdminSkeleton className="h-4 w-28" />
              <AdminSkeleton className="mt-4 h-10 w-20" />
              <AdminSkeleton className="mt-3 h-4 w-24" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <AdminSkeleton className="h-7 w-40" />
            <AdminSkeleton className="mt-3 h-4 w-80 max-w-full" />
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                >
                  <AdminSkeleton className="h-5 w-28" />
                  <AdminSkeleton className="mt-3 h-4 w-full" />
                  <AdminSkeleton className="mt-2 h-4 w-5/6" />
                  <AdminSkeleton className="mt-6 h-4 w-16" />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <AdminSkeleton className="h-7 w-44" />
            <div className="mt-5 space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                >
                  <AdminSkeleton className="h-4 w-28" />
                  <AdminSkeleton className="mt-2 h-5 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
