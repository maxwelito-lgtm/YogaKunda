"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { exigerAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { lieuValide, lireLieu } from "@/data/lieux";
import { DATE_ISO, HEURE, UUID, type Cours } from "@/lib/calendrier";

function actualiser() {
  revalidatePath("/admin/calendrier");
  revalidatePath("/yoga/kundalini");
}

// Ajoute les cours cochés (plus, si elle en a saisi une, une date supplémentaire).
export async function ajouterCours(formData: FormData) {
  await exigerAdmin("/admin/calendrier");

  const lieuBrut = String(formData.get("lieu") ?? "");
  const lieu = lieuValide(lieuBrut) ? lieuBrut : "geronce";
  const modele = lireLieu(lieu);
  const retour = `/admin/calendrier/ajouter?lieu=${lieu}`;

  const debut = String(formData.get("debut") ?? "");
  const fin = String(formData.get("fin") ?? "");
  if (!HEURE.test(debut) || !HEURE.test(fin) || debut >= fin) {
    redirect(`${retour}&erreur=heures`);
  }

  const dates = new Set<string>();
  for (const v of formData.getAll("dates")) {
    const t = String(v);
    if (DATE_ISO.test(t)) dates.add(t);
  }
  const autre = String(formData.get("autre") ?? "");
  if (DATE_ISO.test(autre)) dates.add(autre);

  if (dates.size === 0) redirect(`${retour}&erreur=dates`);
  if (dates.size > 80) redirect(`${retour}&erreur=trop`);

  const lignes = [...dates].sort().map((jour) => ({
    lieu,
    jour,
    heure_debut: debut || modele.debut,
    heure_fin: fin || modele.fin,
    statut: "prevu",
  }));

  const { data, error } = await createAdminClient()
    .from("cours_calendrier")
    .upsert(lignes, { onConflict: "lieu,jour", ignoreDuplicates: true })
    .select("id");
  if (error) {
    console.error("Admin : ajout de cours au calendrier", error);
    redirect(`${retour}&erreur=enregistrement`);
  }

  actualiser();
  redirect(`/admin/calendrier?mois=${lignes[0].jour.slice(0, 7)}&ajoutes=${data?.length ?? 0}`);
}

// Enregistre les changements d'un cours (statut, date, heures, places, note).
export async function enregistrerCours(formData: FormData) {
  await exigerAdmin("/admin/calendrier");

  const id = String(formData.get("id") ?? "");
  if (!UUID.test(id)) redirect("/admin/calendrier");
  const retour = `/admin/calendrier/${id}`;

  const jour = String(formData.get("jour") ?? "");
  const debut = String(formData.get("debut") ?? "");
  const fin = String(formData.get("fin") ?? "");
  if (!DATE_ISO.test(jour)) redirect(`${retour}?erreur=date`);
  if (!HEURE.test(debut) || !HEURE.test(fin) || debut >= fin) {
    redirect(`${retour}?erreur=heures`);
  }

  const annule = formData.get("statut") === "annule";
  const placesNum = parseInt(String(formData.get("places") ?? ""), 10);
  const places = Number.isFinite(placesNum) && placesNum > 0 && placesNum <= 200 ? placesNum : null;
  const complet = formData.get("complet") === "on";
  const note = String(formData.get("note") ?? "").trim().slice(0, 200);

  const admin = createAdminClient();
  const { data: actuel } = await admin
    .from("cours_calendrier")
    .select("jour, jour_initial")
    .eq("id", id)
    .maybeSingle();
  if (!actuel) redirect("/admin/calendrier");

  // Un cours déplacé garde la trace de sa date d'origine ; s'il y revient, il n'est plus « déplacé ».
  const origine: string = actuel.jour_initial ?? actuel.jour;
  const deplace = jour !== origine;
  const statut: Cours["statut"] = annule ? "annule" : deplace ? "deplace" : "prevu";

  const { error } = await admin
    .from("cours_calendrier")
    .update({
      jour,
      heure_debut: debut,
      heure_fin: fin,
      statut,
      jour_initial: deplace ? origine : null,
      places,
      complet,
      note: note || null,
    })
    .eq("id", id);

  if (error) {
    console.error("Admin : modification d'un cours", error);
    redirect(`${retour}?erreur=${error.code === "23505" ? "existe" : "enregistrement"}`);
  }

  actualiser();
  redirect(`/admin/calendrier?mois=${jour.slice(0, 7)}&enregistre=1`);
}

export async function supprimerCours(formData: FormData) {
  await exigerAdmin("/admin/calendrier");

  const id = String(formData.get("id") ?? "");
  if (!UUID.test(id)) redirect("/admin/calendrier");

  const { error } = await createAdminClient().from("cours_calendrier").delete().eq("id", id);
  if (error) console.error("Admin : suppression d'un cours", error);

  actualiser();
  redirect("/admin/calendrier?supprime=1");
}