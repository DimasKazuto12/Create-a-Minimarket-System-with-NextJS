"use client";

import { useState, useTransition } from "react";
import { clockInAction, clockOutAction } from "@/actions/attendance.actions";

type Props = { clockedIn: boolean; clockedOut: boolean };

export function ClockButtons({ clockedIn, clockedOut }: Props) {
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function run(fn: typeof clockInAction) {
    start(async () => {
      const res = await fn();
      setError("error" in res && res.error ? res.error : "");
    });
  }

  return (
    <div>
      {!clockedIn ? (
        <button
          disabled={pending}
          onClick={() => run(clockInAction)}
          className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-emerald-950 hover:bg-emerald-300 disabled:opacity-60"
        >
          Absen masuk
        </button>
      ) : !clockedOut ? (
        <button
          disabled={pending}
          onClick={() => run(clockOutAction)}
          className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-emerald-950 hover:bg-emerald-50 disabled:opacity-60"
        >
          Absen pulang
        </button>
      ) : (
        <p className="rounded-xl bg-white/10 px-4 py-3 text-center text-sm">Sampai jumpa besok 👋</p>
      )}
      {error && <p className="mt-2 text-sm text-red-300">{error}</p>}
    </div>
  );
}