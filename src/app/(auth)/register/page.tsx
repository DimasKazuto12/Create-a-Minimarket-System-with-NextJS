import Link from "next/link";
import RegisterForm from "./RegisterForm";

export const metadata = { title: "Daftar — Toko Kita" };

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Buat akun baru</h1>
      <p className="mb-8 mt-2 text-sm text-stone-500">
        Semua akun baru terdaftar sebagai pelanggan.
      </p>

      <RegisterForm />

      <p className="mt-4 rounded-xl bg-stone-100 px-4 py-3 text-xs leading-relaxed text-stone-500">
        Karyawan? Daftar dulu seperti biasa, lalu minta admin utama mengubah role akunmu.
      </p>

      <p className="mt-6 text-center text-sm text-stone-500">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-emerald-700 hover:underline">
          Masuk
        </Link>
      </p>
    </>
  );
}