"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { db } from "@/prisma/db";
import { encrypt, SESSION_COOKIE, type Role } from "@/lib/session";
import { HOME_BY_ROLE } from "@/lib/rbac";

const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

async function startSession(user: { id: string; name: string; role: Role }) {
  const token = await encrypt({ userId: user.id, name: user.name, role: user.role });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export type FormState =
  | { error?: string; values?: { name?: string; email?: string } }
  | undefined;

export async function registerAction(_: FormState, formData: FormData): Promise<FormState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
  };

  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0].message, values };

  const { name, email, password } = parsed.data;

  const exists = await db.orm.public.User.first({ email });
  if (exists) return { error: "Email sudah terdaftar", values };

  const user = await db.orm.public.User.create({
    name,
    email,
    passwordHash: await bcrypt.hash(password, 10),
    role: "CUSTOMER", // selalu pelanggan; role staf hanya diubah admin utama
  });

  await startSession(user);
  redirect(HOME_BY_ROLE.CUSTOMER);
}

export async function loginAction(_: FormState, formData: FormData): Promise<FormState> {
  const values = { email: String(formData.get("email") ?? "") };

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Email atau password tidak valid", values };

  const user = await db.orm.public.User.first({ email: parsed.data.email });
  const ok = user && user.isActive && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!user || !ok) return { error: "Email atau password salah", values };

  await startSession(user);
  redirect(HOME_BY_ROLE[user.role]);
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}