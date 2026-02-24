
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
    <div className="flex flex-row justify-between p-6 gap-4 w-full">
      <div className="relative border border-slate-300 focus-within:border-slate-700 flex items-center h-10 rounded-xl w-full max-w-md">
        <Search className="absolute left-2" color="gray" size={18} />
        <input
          placeholder="Rechercher"
          defaultValue={searchParam.get("q")?.toString()}
          onChange={(e) => updateUrl("q", e.target.value)}
          className="w-full border-none ml-8 outline-none focus:ring-0"
        />
      </div>

      <select
        className="border rounded px-2"
        value={searchParam.get("type") ?? ""}
        onChange={(e) => updateUrl("type", e.target.value)}
      >
        <option value="">Tous</option>
        <option value="paid">Payant</option>
        <option value="free">Gratuit</option>
      </select>

      <select
        className="border rounded px-2"
        value={searchParam.get("sort") ?? "desc"}
        onChange={(e) => updateUrl("sort", e.target.value)}
      >
        <option value="desc">Recent</option>
        <option value="asc">Anciens</option>
      </select>
    </div>
  );
}
