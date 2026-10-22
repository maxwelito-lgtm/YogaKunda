"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { extraireIdYoutube } from "@/lib/youtube";

const IDENTIFIANT = /^[A-Za-z0-9-]{1,64}$/;

function actualiser() {
  revalidatePath("/admin");
  revalidatePath("/admin/contenus");
  revalidatePath("/mon-espace", "layout");
}

// Ajoute un contenu : les informations vont dans « cours », le lien YouTube dans une table fermée.
export async function ajouterContenu(formData: FormData) {
  await exigerAdmin("/admin/contenus");

  const titre = String(formData.get("titre") ?? "").trim().slice(0, 120);
  const description = String(formData.get("description") ?? "").trim().slice(0, 600);
  const type = formData.get("type") === "audio" ? "audio" : "video";
  const categorie = formData.get("categorie") === "podcasts" ? "podcasts" : "replays";
  const sousBrute = String(formData.get("sous") ?? "");
  const sous =
    categorie === "replays" && ["nidra", "kundalini", "divers"].includes(sousBrute)
      ? sousBrute
      : null;
  const dureeNum = parseInt(String(formData.get("duree") ?? ""), 10);
  const duree = Number.isFinite(dureeNum) && dureeNum > 0 && dureeNum <= 600 ? dureeNum : null;
  const publie = formData.get("publier") === "on";
  const videoId = extraireIdYoutube(String(formData.get("lien") ?? ""));

  if (!titre) redirect("/admin/contenus/nouveau?erreur=titre");
  if (!videoId) redirect("/admin/contenus/nouveau?erreur=lien");

  const admin = createAdminClient();
  const { data: cours, error } = await admin
    .from("cours")
    .insert({
      categorie,
      sous_categorie: sous,
      titre,
      description: description || null,
      type,
      duree_minutes: duree,
      publie,
    })
    .select("id")
    .single();
  if (error || !cours) {
    console.error("Admin : ajout d'un contenu", error);
    redirect("/admin/contenus/nouveau?erreur=enregistrement");
  }

  const { error: erreurMedia } = await admin
    .from("cours_medias")
    .insert({ cours_id: String(cours.id), video_id: videoId });
  if (erreurMedia) {
    console.error("Admin : ajout du lien vidéo", erreurMedia);
    await admin.from("cours").delete().eq("id", cours.id);
    redirect("/admin/contenus/nouveau?erreur=enregistrement");
  }

  actualiser();
  redirect("/admin/contenus?ajoute=1");
}

// Publier ou remettre en brouillon (le contenu disparaît alors du site, sans être supprimé).
export async function basculerPublication(formData: FormData) {
  await exigerAdmin("/admin/contenus");

  const id = String(formData.get("id") ?? "");
  if (!IDENTIFIANT.test(id)) return;
  const publie = formData.get("publie") === "true";

  const { error } = await createAdminClient().from("cours").update({ publie }).eq("id", id);
  if (error) console.error("Admin : publication", error);
  actualiser();
}

export async function supprimerContenu(formData: FormData) {
  await exigerAdmin("/admin/contenus");

  const id = String(formData.get("id") ?? "");
  if (!IDENTIFIANT.test(id)) return;

  const admin = createAdminClient();
  await admin.from("cours_medias").delete().eq("cours_id", id);
  const { error } = await admin.from("cours").delete().eq("id", id);
  if (error) console.error("Admin : suppression", error);
  actualiser();
}