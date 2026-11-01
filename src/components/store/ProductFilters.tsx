"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Select } from "@/components/ui/Select";

const SORTS = [
  { value: "terbaru", label: "Terbaru" },
  { value: "termurah", label: "Harga terendah" },
  { value: "termahal", label: "Harga tertinggi" },
  { value: "nama", label: "Nama A–Z" },
];

type Props = { q: string; kategori: string; urut: string; categories: { id: string; name: string }[] };

export function ProductFilters({ q, kategori, urut, categories }: Props) {
  const router = useRouter();
  const [text, setText] = useState(q);

  function go(next: Partial<{ q: string; kategori: string; urut: string }>) {
    const v = { q: text, kategori, urut, ...next };
    const p = new URLSearchParams();
    if (v.q) p.set("q", v.q);
    if (v.kategori) p.set("kategori", v.kategori);
    if (v.urut && v.urut !== "terbaru") p.set("urut", v.urut);
    const qs = p.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  }

  const chip = (active: boolean) =>
    `shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition ${
      active ? "bg-stone-900 text-white" : "bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50"
    }`;

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <form
          className="relative flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            go({});
          }}
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cari produk…"
            className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
          />
        </form>
        <div className="sm:w-52">
          <Select value={urut || "terbaru"} onChange={(v) => go({ urut: v })} options={SORTS} aria-label="Urutkan" />
        </div>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        <button onClick={() => go({ kategori: "" })} className={chip(!kategori)}>Semua</button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => go({ kategori: c.id })} className={chip(kategori === c.id)}>
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}