"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { createReviewAction } from "@/actions/review.actions";
import { useAuth } from "./AuthModal";

type Props = { productId: string; mine?: { rating: number; comment: string } };

export function ReviewForm({ productId, mine }: Props) {
  const { user, openLogin } = useAuth();
  const [rating, setRating] = useState(mine?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(mine?.comment ?? "");
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  if (!user) {
    return (
      <div className="rounded-3xl bg-white p-6 ring-1 ring-stone-200">
        <p className="font-semibold text-stone-900">Sudah pernah membeli barang ini?</p>
        <p className="mt-1 text-sm text-stone-500">Masuk untuk menulis ulasan.</p>
        <button
          onClick={() => openLogin("Masuk untuk menulis ulasan.", `/products/${productId}`)}
          className="mt-4 rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
        >
          Masuk untuk menulis ulasan
        </button>
      </div>
    );
  }

  if (user.role !== "CUSTOMER") {
    return <p className="rounded-3xl bg-white p-6 text-sm text-stone-500 ring-1 ring-stone-200">Ulasan hanya bisa ditulis oleh akun pelanggan.</p>;
  }

  function submit() {
    setMessage(null);
    start(async () => {
      const res = await createReviewAction(productId, rating, comment);
      if ("error" in res) setMessage({ ok: false, text: res.error ?? "" });
      else setMessage({ ok: true, text: mine ? "Ulasanmu diperbarui." : "Terima kasih atas ulasanmu!" });
    });
  }

  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-stone-200">
      <p className="font-semibold text-stone-900">{mine ? "Ubah ulasanmu" : "Tulis ulasan"}</p>

      <div className="my-3 flex gap-1" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i} bintang`}
            onMouseEnter={() => setHover(i)}
            onClick={() => setRating(i)}
          >
            <Star className={`size-7 transition ${i <= (hover || rating) ? "fill-amber-400 text-amber-400" : "text-stone-300"}`} />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        maxLength={500}
        placeholder="Ceritakan pengalamanmu dengan barang ini…"
        className="w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
      />

      {message && (
        <p className={`mt-2 text-sm ${message.ok ? "text-emerald-700" : "text-red-600"}`}>{message.text}</p>
      )}

      <button
        onClick={submit}
        disabled={pending}
        className="mt-3 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {pending ? "Menyimpan…" : mine ? "Perbarui ulasan" : "Kirim ulasan"}
      </button>
    </div>
  );
}