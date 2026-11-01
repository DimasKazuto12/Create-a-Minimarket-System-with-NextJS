"use client";

import { useActionState, useState } from "react";
import { createProductAction } from "@/actions/product.actions";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { SubmitButton } from "@/components/ui/SubmitButton";

type State = { error?: string; ok?: boolean; values?: Record<string, string> } | undefined;
type Props = { categories: { id: string; name: string }[] };

export function AddProductForm({ categories }: Props) {
  const [cat, setCat] = useState("");
  const [state, action, pending] = useActionState<State, FormData>(async (_prev, formData) => {
    const res = await createProductAction(formData);
    if ("error" in res && res.error) {
      return { error: res.error, values: Object.fromEntries(formData) as Record<string, string> };
    }
    return { ok: true };
  }, undefined);

  const v = state?.values;
  const options = [
    { value: "", label: "Tanpa kategori" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
    { value: "__new__", label: "+ Kategori baru…" },
  ];

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Barcode" name="barcode" defaultValue={v?.barcode} required />
        <Field label="Nama barang" name="name" defaultValue={v?.name} required />
        <Field label="Harga (Rp)" name="price" type="number" min={1} defaultValue={v?.price} required />
        <div className="space-y-1.5">
          <span className="text-sm font-medium text-stone-700">Kategori</span>
          <Select name="categoryId" value={cat} onChange={setCat} options={options} />
        </div>
        <Field label="Stok awal" name="stock" type="number" min={0} defaultValue={v?.stock ?? "0"} />
        <Field label="Batas menipis" name="minStock" type="number" min={0} defaultValue={v?.minStock ?? "5"} />
        {cat === "__new__" && (
          <Field label="Nama kategori baru" name="newCategory" defaultValue={v?.newCategory} required />
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-stone-700">Deskripsi (tampil di halaman produk)</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={1000}
          defaultValue={v?.description}
          className="w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
        />
      </div>

      {state?.error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>}
      {state?.ok && <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Barang berhasil ditambahkan.</p>}

      <div className="max-w-xs">
        <SubmitButton pending={pending}>Simpan barang</SubmitButton>
      </div>
    </form>
  );
}