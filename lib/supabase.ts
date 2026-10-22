import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
// Klien server-only. Mengembalikan null bila env belum diisi, sehingga situs tetap jalan tanpa database.
export const db = () => {
  const u = process.env.SUPABASE_URL,
    k = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return u && k
    ? createClient(u, k, { auth: { persistSession: false } })
    : null;
};
export const hashIp = (req: Request) =>
  createHash("sha256")
    .update(
      (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim() +
        (process.env.IP_SALT ?? "salt"),
    )
    .digest("hex")
    .slice(0, 32);
export const isAdmin = (req: Request) => {
  const p = process.env.ADMIN_PASSWORD;
  return !!p && req.headers.get("x-admin-key") === p;
};
