import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata = { title: "Masuk — Toko Kita" };

export default function LoginPage() {
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Selamat datang kembali</h1>
      <p className="mb-8 mt-2 text-sm text-stone-500">Masuk untuk lanjut belanja atau bekerja.</p>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-stone-500">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-emerald-700 hover:underline">
          Daftar
        </Link>
      </p>
    </>
  );
}