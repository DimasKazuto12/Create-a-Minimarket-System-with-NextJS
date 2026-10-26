import { db } from "@/prisma/db";
import { io } from "next/cache";
import { requireRole } from "@/lib/auth";
import { STAFF_ROLES } from "@/lib/rbac";
import { todayWIB } from "@/lib/date";
import { formatDay, formatTime } from "@/lib/format";
import { PageHeader } from "@/components/ui/PageHeader";
import { ClockButtons } from "./ClockButtons";

function duration(inMs: number, outMs: number) {
  const minutes = Math.max(0, Math.round((outMs - inMs) / 60000));
  return `${Math.floor(minutes / 60)} j ${minutes % 60} m`;
}

export async function AttendanceContent() {
  await io();
  
  const session = await requireRole(...STAFF_ROLES);
  const today = todayWIB();

  const mine = await db.orm.public.Attendance
    .where({ userId: session.userId })
    .orderBy((a) => a.day.desc())
    .limit(14)
    .all();
  const todayRow = mine.find((a) => a.day === today);

  const team =
    session.role === "SUPER_ADMIN"
      ? await db.orm.public.Attendance.where({ day: today }).include("user").all()
      : [];

  return (
    <>
      <PageHeader title="Absensi" description={formatDay(today)} />

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <section className="rounded-3xl bg-emerald-950 p-6 text-white">
          <p className="text-sm text-emerald-200">Status hari ini</p>
          <p className="mt-2 text-2xl font-bold">
            {!todayRow ? "Belum absen masuk" : todayRow.clockOut ? "Sudah pulang" : "Sedang bekerja"}
          </p>
          {todayRow && (
            <p className="mt-1 text-sm text-emerald-200">
              Masuk {formatTime(todayRow.clockIn)}
              {todayRow.clockOut && ` · Pulang ${formatTime(todayRow.clockOut)}`}
            </p>
          )}
          <div className="mt-6">
            <ClockButtons clockedIn={!!todayRow} clockedOut={!!todayRow?.clockOut} />
          </div>
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-stone-900">Riwayat 14 hari terakhir</h2>
          <ul className="divide-y divide-stone-100 text-sm">
            {mine.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2.5">
                <span className="text-stone-700">{formatDay(a.day)}</span>
                <span className="text-stone-500">
                  {formatTime(a.clockIn)} – {a.clockOut ? formatTime(a.clockOut) : "…"}
                  {a.clockOut && (
                    <span className="ml-2 font-medium text-stone-900">
                      {duration(a.clockIn.epochMilliseconds, a.clockOut.epochMilliseconds)}
                    </span>
                  )}
                </span>
              </li>
            ))}
            {mine.length === 0 && <li className="py-6 text-center text-stone-400">Belum ada riwayat.</li>}
          </ul>
        </section>
      </div>

      {session.role === "SUPER_ADMIN" && (
        <section className="rounded-3xl border border-stone-200 bg-white p-6">
          <h2 className="mb-4 font-semibold text-stone-900">Kehadiran tim hari ini</h2>
          <ul className="divide-y divide-stone-100 text-sm">
            {team.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2.5">
                <span className="font-medium text-stone-900">{a.user.name}</span>
                <span className="text-stone-500">
                  {formatTime(a.clockIn)} – {a.clockOut ? formatTime(a.clockOut) : "masih bekerja"}
                </span>
              </li>
            ))}
            {team.length === 0 && <li className="py-6 text-center text-stone-400">Belum ada yang absen.</li>}
          </ul>
        </section>
      )}
    </>
  );
}