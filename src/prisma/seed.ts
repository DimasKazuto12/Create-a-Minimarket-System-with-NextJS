import "dotenv/config";
import 'temporal-polyfill/full/global';
import bcrypt from "bcryptjs";
import { db } from "./db";

async function main() {
  const email = "admin@toko.com";
  const exists = await db.orm.public.User.first({ email });
  if (exists) return;

  await db.orm.public.User.create({
    name: "Admin Utama",
    email,
    passwordHash: await bcrypt.hash("GantiPasswordIni123", 10),
    role: "SUPER_ADMIN",
  });
}

main().finally(() => db.close());