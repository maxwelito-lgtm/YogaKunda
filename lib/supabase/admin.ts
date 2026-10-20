import { createClient } from "@supabase/supabase-js";

// Client à droits complets : à n'utiliser que dans du code serveur (webhook, paiement).
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !cle) throw new Error("Configuration Supabase serveur manquante");
  return createClient(url, cle, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}