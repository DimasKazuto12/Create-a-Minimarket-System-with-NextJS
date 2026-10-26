import { Logo } from "@/components/ui/Logo";
import { cacheLife } from 'next/cache';

async function getCurrentYear() {
  'use cache';
  cacheLife('max');
  return new Date().getFullYear();
}

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const year = await getCurrentYear();
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Panel kiri (hanya desktop) */}
      <aside className="relative hidden overflow-hidden bg-emerald-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 size-96 rounded-full bg-lime-400/10 blur-3xl" />

        <Logo tone="light" className="relative z-10" />

        <div className="relative z-10 space-y-8">
          <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
            Satu sistem untuk seluruh toko.
          </h2>

          <div className="grid max-w-lg grid-cols-2 gap-3">
            <div className="col-span-2 rounded-3xl bg-white/10 p-6 backdrop-blur">
              <p className="text-sm text-emerald-200">Kasir</p>
              <p className="mt-1 text-xl font-semibold">Scan barang lewat kamera HP</p>
            </div>
            <div className="rounded-3xl bg-emerald-400 p-6 text-emerald-950">
              <p className="text-sm font-medium opacity-70">Stok</p>
              <p className="mt-1 text-lg font-semibold">Pantau dan tambah stok</p>
            </div>
            <div className="rounded-3xl bg-white/10 p-6 backdrop-blur">
              <p className="text-sm text-emerald-200">Pegawai</p>
              <p className="mt-1 text-lg font-semibold">Absen harian</p>
            </div>
            <div className="col-span-2 rounded-3xl bg-white p-6 text-emerald-950">
              <p className="text-sm font-medium text-emerald-700">Pelanggan</p>
              <p className="mt-1 text-xl font-semibold">Pesan online tanpa antre</p>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-emerald-200/70">
          ©{year} Toko Kita
        </p>
      </aside>

      {/* Kolom form */}
      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Logo className="mb-10 lg:hidden" />
          {children}
        </div>
      </main>
    </div>
  );
}