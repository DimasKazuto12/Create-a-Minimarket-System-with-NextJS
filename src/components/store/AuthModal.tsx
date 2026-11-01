"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Logo } from "@/components/ui/Logo";
import type { Role } from "@/lib/session";

export type AuthUser = { name: string; role: Role } | null;

type Ctx = {
  user: AuthUser;
  openLogin: (reason?: string, next?: string) => void;
};

const AuthCtx = createContext<Ctx | null>(null);

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth harus dipakai di dalam AuthModalProvider");
  return ctx;
}

export function AuthModalProvider({ user, children }: { user: AuthUser; children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [reason, setReason] = useState("Masuk untuk melanjutkan.");
  const [next, setNext] = useState("/");

  const openLogin = useCallback((why = "Masuk untuk melanjutkan.", to?: string) => {
    setReason(why);
    setNext(to ?? window.location.pathname);
    setMode("login");
    setOpen(true);
  }, []);

  // Sinkronkan state dengan elemen <dialog>
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  // Setelah berhasil login, sesi masuk dari server: tutup modal
  const isOpen = open && !user;

  const value = useMemo(() => ({ user, openLogin }), [user, openLogin]);

  return (
    <AuthCtx.Provider value={value}>
      {children}

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false); // klik latar gelap
        }}
        className="m-auto w-[min(92vw,420px)] rounded-3xl bg-white p-0 text-stone-900 shadow-2xl backdrop:bg-stone-900/50 backdrop:backdrop-blur-sm open:animate-pop"
      >
        {isOpen && (
          <div className="relative p-6 sm:p-8">
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            >
              <X className="size-5" />
            </button>

            <Logo className="mb-6" />
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {mode === "login" ? "Masuk ke akunmu" : "Buat akun baru"}
            </h2>
            <p className="mb-6 mt-1 text-sm text-stone-500">{reason}</p>

            <div className="mb-5 grid grid-cols-2 rounded-xl bg-stone-100 p-1 text-sm font-semibold">
              {(["login", "register"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-lg py-2 transition ${mode === m ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"}`}
                >
                  {m === "login" ? "Masuk" : "Daftar"}
                </button>
              ))}
            </div>

            {mode === "login" ? <LoginForm next={next} /> : <RegisterForm next={next} />}
          </div>
        )}
      </dialog>
    </AuthCtx.Provider>
  );
}