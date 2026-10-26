"use client";

import { useActionState } from "react";
import { createProductAction } from "@/actions/product.actions";
import { Field } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";

type State = { error?: string; ok?: boolean; values?: Record<string, string> } | undefined;

export function AddProductForm() {
  const [state, action, pending] = useActionState<State, FormData>(async (_prev, formData) => {
    const res = await createProductAction(formData);
    if ("error" in res && res.error) {
      return { error: res.error, values: Object.fromEntries(formData) as Record<string, string> };
    }
    return { ok: true };
  }, undefined);

  const v = state?.values;

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Field label="Barcode" name="barcode" defaultValue={v?.barcode} required />
        <Field label="Nama barang" name="name" defaultValue={v?.name} required />
        <Field label="Harga (Rp)" name="price" type="number" min={1} defaultValue={v?.price} required />
        <Field label="Stok awal" name="stock" type="number" min={0} defaultValue={v?.stock ?? "0"} />
        <Field label="Batas menipis" name="minStock" type="number" min={0} defaultValue={v?.minStock ?? "5"} />
      </div>

      {state?.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p>
      )}
      {state?.ok && (
        <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Barang berhasil ditambahkan.</p>
      )}

      <div className="max-w-xs">
        <SubmitButton pending={pending}>Simpan barang</SubmitButton>
      </div>
    </form>
  );
}