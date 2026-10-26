import { SignJWT, jwtVerify } from "jose";

export type Role = "CUSTOMER" | "CASHIER" | "INVENTORY_ADMIN" | "SUPER_ADMIN";

export type SessionPayload = {
  userId: string;
  name: string;
  role: Role;
};

export const SESSION_COOKIE = "session";
const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function decrypt(token?: string): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}