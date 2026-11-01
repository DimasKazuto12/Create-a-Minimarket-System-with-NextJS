import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/prisma/db";
import { getSession } from "@/lib/auth";
import { formatDateTime, rupiah } from "@/lib/format";
import { tileFor } from "@/lib/tile";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import { BuyNowButton } from "@/components/store/BuyNowButton";
import { ProductCard } from "@/components/store/ProductCard";
import { ReviewForm } from "@/components/store/ReviewForm";
import { Stars } from "@/components/store/Stars";
import { connection } from "next/server";

type Props = { params: Promise<{ id: string }> };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function ProductDetailContent({ params }: Props) {
    await connection();
    const { id } = await params;
    if (!UUID.test(id)) notFound();

    const product = await db.orm.public.Product.first({ id, isActive: true });
    if (!product) notFound();

    const session = await getSession();
    const category = product.categoryId
        ? await db.orm.public.Category.first({ id: product.categoryId })
        : null;

    const reviews = await db.orm.public.Review
        .where({ productId: id })
        .orderBy((r) => r.createdAt.desc())
        .include("user")
        .all();

    const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
    const mine = session ? reviews.find((r) => r.userId === session.userId) : undefined;

    const related = product.categoryId
        ? (
            await db.orm.public.Product
                .where({ isActive: true, categoryId: product.categoryId })
                .limit(5)
                .all()
        )
            .filter((r) => r.id !== product.id)
            .slice(0, 4)
        : [];

    const stockText =
        product.stock === 0 ? "Stok habis" : product.stock <= product.minStock ? `Sisa ${product.stock}, segera habis` : "Stok tersedia";

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <nav className="mb-6 text-sm text-stone-500">
                <Link href="/products" className="hover:text-emerald-700">Produk</Link>
                {category && <> / <Link href={`/products?kategori=${category.id}`} className="hover:text-emerald-700">{category.name}</Link></>}
            </nav>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className={`grid aspect-square place-items-center rounded-[2rem] ${tileFor(product.name)}`}>
                    <span className="font-display text-[10rem] font-extrabold leading-none">{product.name.charAt(0).toUpperCase()}</span>
                </div>

                <div className="flex flex-col">
                    {category && (
                        <span className="w-fit rounded-full bg-accent-soft px-3 py-1 text-xs font-bold text-accent">{category.name}</span>
                    )}
                    <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-tight text-stone-900">{product.name}</h1>

                    <div className="mt-3 flex items-center gap-2 text-sm text-stone-500">
                        <Stars value={avg} />
                        <span>{reviews.length ? `${avg.toFixed(1)} · ${reviews.length} ulasan` : "Belum ada ulasan"}</span>
                    </div>

                    <p className="mt-5 font-display text-4xl font-bold text-emerald-700">{rupiah(product.price)}</p>
                    <p className={`mt-1 text-sm font-medium ${product.stock === 0 ? "text-red-600" : "text-stone-500"}`}>{stockText}</p>

                    <div className="mt-6">
                        <h2 className="mb-1 text-sm font-semibold text-stone-900">Deskripsi</h2>
                        <p className="whitespace-pre-line leading-relaxed text-stone-600">
                            {product.description || "Belum ada deskripsi untuk barang ini."}
                        </p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <BuyNowButton product={{ id: product.id, name: product.name, price: product.price, stock: product.stock }} />
                        <div className="w-40">
                            <AddToCartButton product={{                       
                                id: product.id,
                                name: product.name,
                                price: product.price,
                                stock: product.stock,
                            }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Ulasan */}
            <section className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
                <div>
                    <h2 className="font-display text-2xl font-bold text-stone-900">Ulasan pembeli</h2>
                    <div className="mt-4">
                        <ReviewForm
                            productId={product.id}
                            mine={mine ? { rating: mine.rating, comment: mine.comment } : undefined}
                        />
                    </div>
                </div>

                <ul className="space-y-3">
                    {reviews.slice(0, 30).map((r) => (
                        <li key={r.id} className="rounded-3xl bg-white p-5 ring-1 ring-stone-200">
                            <div className="flex items-center gap-3">
                                <span className="grid size-10 place-items-center rounded-full bg-emerald-100 font-bold text-emerald-700">
                                    {r.user.name.charAt(0).toUpperCase()}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-stone-900">{r.user.name.split(" ")[0]}</p>
                                    <p className="text-xs text-stone-400">{formatDateTime(r.createdAt)}</p>
                                </div>
                                <div className="ml-auto"><Stars value={r.rating} /></div>
                            </div>
                            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-stone-600">{r.comment}</p>
                        </li>
                    ))}
                    {reviews.length === 0 && (
                        <li className="rounded-3xl border border-dashed border-stone-300 p-10 text-center text-sm text-stone-400">
                            Jadilah yang pertama mengulas barang ini.
                        </li>
                    )}
                </ul>
            </section>

            {related.length > 0 && (
                <section className="mt-16">
                    <h2 className="mb-6 font-display text-2xl font-bold text-stone-900">Barang serupa</h2>
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        {related.map((p) => (
                            <ProductCard key={p.id} product={p} category={category?.name} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}