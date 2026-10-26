import type { Role } from "./session";

export const STAFF_ROLES: Role[] = ["CASHIER", "INVENTORY_ADMIN", "SUPER_ADMIN"];

export const ROLE_LABEL: Record<Role, string> = {
  CUSTOMER: "Pelanggan",
  CASHIER: "Kasir",
  INVENTORY_ADMIN: "Admin Barang",
  SUPER_ADMIN: "Admin Utama",
};

export const HOME_BY_ROLE: Record<Role, string> = {
  CUSTOMER: "/shop",
  CASHIER: "/cashier",
  INVENTORY_ADMIN: "/inventory",
  SUPER_ADMIN: "/dashboard",
};

export const ROUTE_RULES: { prefix: string; roles: Role[] }[] = [
  { prefix: "/shop", roles: ["CUSTOMER"] },
  { prefix: "/cart", roles: ["CUSTOMER"] },
  { prefix: "/orders", roles: ["CUSTOMER"] },
  { prefix: "/dashboard", roles: ["SUPER_ADMIN"] },
  { prefix: "/cashier", roles: ["CASHIER", "SUPER_ADMIN"] },
  { prefix: "/online-orders", roles: ["CASHIER", "SUPER_ADMIN"] },
  { prefix: "/inventory", roles: ["INVENTORY_ADMIN", "SUPER_ADMIN"] },
  { prefix: "/attendance", roles: STAFF_ROLES },
  { prefix: "/employees", roles: ["SUPER_ADMIN"] },
];

export type StaffIcon = "dashboard" | "cashier" | "orders" | "stock" | "clock" | "users";

export const STAFF_NAV: { href: string; label: string; icon: StaffIcon; roles: Role[] }[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard", roles: ["SUPER_ADMIN"] },
  { href: "/cashier", label: "Kasir", icon: "cashier", roles: ["CASHIER", "SUPER_ADMIN"] },
  { href: "/online-orders", label: "Pesanan Online", icon: "orders", roles: ["CASHIER", "SUPER_ADMIN"] },
  { href: "/inventory", label: "Stok", icon: "stock", roles: ["INVENTORY_ADMIN", "SUPER_ADMIN"] },
  { href: "/attendance", label: "Absensi", icon: "clock", roles: STAFF_ROLES },
  { href: "/employees", label: "Karyawan", icon: "users", roles: ["SUPER_ADMIN"] },
];