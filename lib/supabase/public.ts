import { createClient } from "@supabase/supabase-js";

// Lecture des données publiques (comme le calendrier des cours), sans connexion.
// Pas de cookies ici : les pages qui l'utilisent peuvent rester en mémoire et se mettre à jour toutes seules.
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}