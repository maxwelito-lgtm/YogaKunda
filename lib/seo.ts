// Référencement : tout ce qui est invisible à l'écran (balises pour Google, données structurées).
// Aucun effet sur la mise en page du site.
import type { Metadata } from "next";
import { site } from "@/site.config";
import { lieux } from "@/data/lieux";
import { urlSite } from "@/lib/url-site";

export const ZONE = "Oloron-Sainte-Marie, Géronce, Béarn, Pyrénées-Atlantiques, Nouvelle-Aquitaine";
export const IMAGE_PARTAGE = "/images/yoga-nature.png";

// Aperçu quand on partage un lien (Facebook, WhatsApp…) : un titre et une description propres à chaque page.
export function partage(titre: string, description: string): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: site.nom,
      title: titre,
      description,
      images: [{ url: IMAGE_PARTAGE }],
    },
    twitter: { card: "summary_large_image", title: titre, description, images: [IMAGE_PARTAGE] },
  };
}

const telInternational = "+33" + site.telephone.replace(/\s/g, "").replace(/^0/, "");

function lieuSchema(l: (typeof lieux)[number]) {
  return {
    "@type": "Place",
    name: `${l.salle} — ${l.ville}`,
    address: {
      "@type": "PostalAddress",
      ...(l.id === "oloron" ? { streetAddress: "5 rue du Gouverneur Général Bordes" } : {}),
      addressLocality: l.id === "oloron" ? "Oloron-Sainte-Marie" : "Géronce",
      postalCode: "64400",
      addressRegion: "Nouvelle-Aquitaine",
      addressCountry: "FR",
    },
  };
}

// Fiche de l'association pour Google : qui, où, comment la joindre.
export function schemaSite() {
  const base = urlSite();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
        "@id": `${base}/#organisation`,
        name: site.nom,
        url: base,
        description:
          "Cours de yoga Kundalini, ateliers tantra, yoga nidra en ligne et thérapie holistique en Béarn.",
        telephone: telInternational,
        email: site.email,
        image: `${base}${IMAGE_PARTAGE}`,
        founder: { "@type": "Person", name: site.association.responsable },
        areaServed: [
          { "@type": "City", name: "Oloron-Sainte-Marie" },
          { "@type": "City", name: "Géronce" },
          { "@type": "AdministrativeArea", name: "Béarn" },
          { "@type": "AdministrativeArea", name: "Nouvelle-Aquitaine" },
        ],
        location: lieux.map(lieuSchema),
        address: {
          "@type": "PostalAddress",
          streetAddress: "4 chemin de Boulau",
          addressLocality: "Féas",
          postalCode: "64570",
          addressRegion: "Nouvelle-Aquitaine",
          addressCountry: "FR",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${base}/#site`,
        url: base,
        name: site.nom,
        inLanguage: "fr-FR",
        publisher: { "@id": `${base}/#organisation` },
      },
    ],
  };
}

type CoursInfo = { nom: string; description: string; chemin: string; enLigne?: boolean; lieuxIds?: string[] };

// Fiche « cours » : permet à Google d'afficher le cours, son lieu et son rythme.
export function schemaCours(c: CoursInfo) {
  const base = urlSite();
  const choisis = lieux.filter((l) => c.lieuxIds?.includes(l.id));
  const instances = c.enLigne
    ? [{ "@type": "CourseInstance", courseMode: "online" }]
    : choisis.map((l) => ({
        "@type": "CourseInstance",
        courseMode: "onsite",
        location: lieuSchema(l),
        courseSchedule: {
          "@type": "Schedule",
          repeatFrequency: "P1W",
          byDay: l.jourSemaine === 1 ? "https://schema.org/Monday" : "https://schema.org/Wednesday",
          startTime: l.debut,
          endTime: l.fin,
          scheduleTimezone: "Europe/Paris",
        },
      }));
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: c.nom,
    description: c.description,
    url: `${base}${c.chemin}`,
    inLanguage: "fr",
    provider: { "@type": "Organization", name: site.nom, url: base },
    ...(instances.length ? { hasCourseInstance: instances } : {}),
  };
}

export function schemaService(nom: string, description: string, chemin: string) {
  const base = urlSite();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: nom,
    description,
    url: `${base}${chemin}`,
    provider: { "@id": `${base}/#organisation` },
    areaServed: { "@type": "AdministrativeArea", name: "Béarn" },
  };
}

// Questions fréquentes : Google peut les afficher directement dans les résultats.
export function schemaFaq(questions: { question: string; reponse: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.reponse },
    })),
  };
}
