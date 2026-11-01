import Link from "next/link";
import { ArrowRight, ClipboardCheck, PackageCheck, ShoppingBasket } from "lucide-react";
import { db } from "@/prisma/db";
import { STORE } from "@/lib/store-info";
import { ProductCard } from "@/components/store/ProductCard";
import { connection } from "next/server";

const STEPS = [
    { icon: ShoppingBasket, title: "Pilih barang", text: "Telusuri produk, baca deskripsi dan ulasan pembeli lain." },
    { icon: ClipboardCheck, title: "Kirim pesanan", text: "Masukkan ke keranjang, lalu kirim pesananmu ke toko." },
    { icon: PackageCheck, title: "Ambil di toko", text: "Kami siapkan pesananmu. Tunjukkan kode, bayar, selesai." },
];

export async function HomeContent() {
    await connection();
    const categories = await db.orm.public.Category.orderBy((c) => c.name.asc()).all();
    const latest = await db.orm.public.Product
        .where({ isActive: true })
        .orderBy((p) => p.createdAt.desc())
        .limit(8)
        .all();

    const categoryName = new Map(categories.map((c) => [c.id, c.name]));

    return (
        <>
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-emerald-200/60 blur-3xl" />
                <div className="pointer-events-none absolute -left-24 top-40 size-72 rounded-full bg-accent-soft blur-3xl" />

                <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                            <span className="size-2 rounded-full bg-emerald-500" /> Pesan online, ambil di toko
                        </span>
                        <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-stone-900 sm:text-6xl">
                            Belanja harian, <span className="text-emerald-600">tanpa antre.</span>
                        </h1>
                        <p className="mt-5 max-w-lg text-lg leading-relaxed text-stone-600">{STORE.description}</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/products"
                                className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                            >
                                Mulai belanja <ArrowRight className="size-4" />
                            </Link>
                            <a href="#cara-pesan" className="rounded-2xl bg-white px-6 py-3.5 font-semibold text-stone-800 ring-1 ring-stone-200 hover:bg-stone-50">
                                Cara pesan
                            </a>
                        </div>
                    </div>

                    {/* Kartu ilustrasi */}
                    <div className="relative mx-auto w-full max-w-sm">
                        <div className="rotate-2 rounded-3xl bg-emerald-950 p-6 text-white shadow-2xl shadow-emerald-950/30">
                            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Pesananmu</p>
                            <p className="mt-1 font-mono text-sm">INV-20261027-A1B2</p>
                            <div className="my-5 space-y-2 text-sm">
                                <p className="flex justify-between"><span>2× Susu UHT 1L</span><span className="text-emerald-300">Rp36.000</span></p>
                                <p className="flex justify-between"><span>1× Roti tawar</span><span className="text-emerald-300">Rp17.500</span></p>
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-bold text-emerald-950">
                                <PackageCheck className="size-5" /> Siap diambil
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -left-4 -rotate-3 rounded-2xl bg-white px-5 py-3 shadow-xl ring-1 ring-stone-200">
                            <p className="text-xs text-stone-500">Tanpa antre</p>
                            <p className="font-display text-lg font-bold text-stone-900">±10 menit</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Kategori */}
            {categories.length > 0 && (
                <section className="mx-auto max-w-6xl px-4 py-6">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((c) => (
                            <Link
                                key={c.id}
                                href={`/products?kategori=${c.id}`}
                                className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-stone-700 ring-1 ring-stone-200 transition hover:bg-emerald-600 hover:text-white hover:ring-emerald-600"
                            >
                                {c.name}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Barang terbaru */}
            <section className="mx-auto max-w-6xl px-4 py-10">
                <div className="mb-6 flex items-end justify-between">
                    <h2 className="font-display text-3xl font-bold tracking-tight text-stone-900">Baru di rak</h2>
                    <Link href="/products" className="text-sm font-semibold text-emerald-700 hover:underline">Lihat semua →</Link>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {latest.map((p) => (
                        <ProductCard key={p.id} product={p} category={p.categoryId ? categoryName.get(p.categoryId) : undefined} />
                    ))}
                    {latest.length === 0 && (
                        <p className="col-span-full rounded-3xl border border-dashed border-stone-300 p-12 text-center text-stone-400">
                            Belum ada barang yang dijual.
                        </p>
                    )}
                </div>
            </section>

            {/* Cara pesan */}
            <section id="cara-pesan" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-12">
                <h2 className="mb-8 font-display text-3xl font-bold tracking-tight text-stone-900">Cara pesan</h2>
                <div className="grid gap-4 md:grid-cols-3">
                    {STEPS.map(({ icon: Icon, title, text }, i) => (
                        <div key={title} className="relative rounded-3xl bg-white p-6 ring-1 ring-stone-200">
                            <span className="absolute right-5 top-4 font-display text-6xl font-extrabold text-stone-100">{i + 1}</span>
                            <span className="relative grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                                <Icon className="size-6" />
                            </span>
                            <h3 className="relative mt-5 font-display text-xl font-bold text-stone-900">{title}</h3>
                            <p className="relative mt-1 text-sm leading-relaxed text-stone-500">{text}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}