"use server";

import { revalidatePath } from "next/cache";
import { exigerAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

const IDENTIFIANT = /^[A-Za-z0-9-]{1,64}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function actualiser() {
  revalidatePath("/admin");
  revalidatePath("/admin/reservations");
}

// Chantal a rappelé la personne : on le note, avec la date de séance si elle la connaît.
export async function marquerRappelee(formData: FormData) {
  await exigerAdmin("/admin/reservations"); // vérifié à chaque clic, pas seulement à l'affichage

  const id = String(formData.get("id") ?? "");
  const dateBrute = String(formData.get("date") ?? "");
  if (!IDENTIFIANT.test(id)) return;
  const date = DATE.test(dateBrute) && !Number.isNaN(Date.parse(dateBrute)) ? dateBrute : null;

  const { error } = await createAdminClient()
    .from("commandes")
    .update({ rappelee_le: new Date().toISOString(), date_fixee: date })
    .eq("id", id)
    .eq("statut", "payee");
  if (error) console.error("Admin : marquer rappelée", error);

  actualiser();
}

// Correction d'une erreur de clic : la personne repasse dans « À rappeler ».
export async function remettreARappeler(formData: FormData) {
  await exigerAdmin("/admin/reservations");

  const id = String(formData.get("id") ?? "");
  if (!IDENTIFIANT.test(id)) return;

  const { error } = await createAdminClient()
    .from("commandes")
    .update({ rappelee_le: null, date_fixee: null })
    .eq("id", id)
    .eq("statut", "payee");
  if (error) console.error("Admin : remettre à rappeler", error);

  actualiser();
}