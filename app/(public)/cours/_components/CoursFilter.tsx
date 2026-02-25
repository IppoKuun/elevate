
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export function CoursFilter() {
  const router = useRouter();
  const searchParam = useSearchParams();
  const pathname = usePathname();

  function updateUrl(key: string, value: string) {
    const params = new URLSearchParams(searchParam.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex w-full flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex h-11 w-full items-center rounded-xl border border-slate-300 transition focus-within:border-slate-700 focus-within:ring-2 focus-within:ring-slate-100">
        <Search className="absolute left-3 text-slate-500" size={18} />
        <input
          placeholder="Rechercher"
          defaultValue={searchParam.get("q")?.toString()}
          onChange={(e) => updateUrl("q", e.target.value)}
          className="h-full w-full rounded-xl border-none bg-transparent pl-10 pr-3 text-sm text-slate-800 outline-none focus:ring-0"
        />
      </div>

      <select
        className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
        value={searchParam.get("type") ?? ""}
        onChange={(e) => updateUrl("type", e.target.value)}
      >
        <option value="">Tous</option>
        <option value="paid">Payant</option>
        <option value="free">Gratuit</option>
      </select>

      <select
        className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-100"
        value={searchParam.get("sort") ?? "desc"}
        onChange={(e) => updateUrl("sort", e.target.value)}
      >
        <option value="desc">Recent</option>
        <option value="asc">Anciens</option>
      </select>
      </div>
    </div>
  );
}
