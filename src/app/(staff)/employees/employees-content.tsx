import Link from "next/link";
import { db } from "@/prisma/db";
import { requireRole } from "@/lib/auth";
import { io } from "next/cache";
import { ROLE_LABEL } from "@/lib/rbac";
import { todayWIB } from "@/lib/date";
import { formatDay } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { RoleSelect } from "./RoleSelect";
import { ActiveToggle } from "./ActiveToggle";

type Props = { searchParams: Promise<{ tampil?: string }> };

const TABS = [
  ["semua", "Semua"],
  ["staf", "Staf"],
  ["pelanggan", "Pelanggan"],
] as const;

export async function EmployeesContent({ searchParams }: Props) {
  await io();   
  const session = await requireRole("SUPER_ADMIN");
  const { tampil = "semua" } = await searchParams;

  const users = await db.orm.public.User.orderBy((u) => u.createdAt.desc()).all();
  const attendance = await db.orm.public.Attendance.where({ day: todayWIB() }).all();
  const present = new Set(attendance.map((a) => a.userId));

  const staffCount = users.filter((u) => u.role !== "CUSTOMER").length;
  const shown =
    tampil === "staf"
      ? users.filter((u) => u.role !== "CUSTOMER")
      : tampil === "pelanggan"
        ? users.filter((u) => u.role === "CUSTOMER")
        : users;

  return (
    <>
      <PageHeader
        title="Karyawan & Akun"
        description="Ubah role akun yang mendaftar menjadi kasir, admin barang, atau admin utama."
      />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div className="rounded-3xl bg-emerald-600 p-5 text-white">
          <p className="text-sm opacity-80">Staf</p>
          <p className="mt-1 text-3xl font-bold">{staffCount}</p>
        </div>
        <div className="rounded-3xl border border-stone-200 bg-white p-5">
          <p className="text-sm text-stone-500">Pelanggan</p>
          <p className="mt-1 text-3xl font-bold text-stone-900">{users.length - staffCount}</p>
        </div>
        <div className="col-span-2 rounded-3xl border border-stone-200 bg-white p-5 sm:col-span-1">
          <p className="text-sm text-stone-500">Hadir hari ini</p>
          <p className="mt-1 text-3xl font-bold text-stone-900">{present.size}</p>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        {TABS.map(([key, label]) => (
          <Link
            key={key}
            href={`/employees?tampil=${key}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              tampil === key ? "bg-stone-900 text-white" : "bg-white text-stone-600 ring-1 ring-stone-200"
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-stone-100 text-xs uppercase tracking-wide text-stone-400">
            <tr>
              <th className="px-5 py-3 font-medium">Akun</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Hari ini</th>
              <th className="px-5 py-3 font-medium">Aktif</th>
              <th className="px-5 py-3 font-medium">Bergabung</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {shown.map((u) => {
              const isSelf = u.id === session.userId;
              return (
                <tr key={u.id}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-stone-900">
                      {u.name} {isSelf && <span className="text-xs font-normal text-stone-400">(kamu)</span>}
                    </p>
                    <p className="text-xs text-stone-500">{u.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <RoleSelect userId={u.id} role={u.role} disabled={isSelf} />
                  </td>
                  <td className="px-5 py-4">
                    {u.role === "CUSTOMER" ? (
                      <span className="text-stone-300">-</span>
                    ) : present.has(u.id) ? (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">Hadir</span>
                    ) : (
                      <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">Belum</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <ActiveToggle userId={u.id} active={u.isActive} disabled={isSelf} />
                  </td>
                  <td className="px-5 py-4 text-stone-500">
                    {formatDay(new Date(u.createdAt.epochMilliseconds).toISOString().slice(0, 10))}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-stone-400">
        Perubahan role berlaku setelah pengguna yang bersangkutan login ulang.
      </p>
    </>
  );
}