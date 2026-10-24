import type { MetadataRoute } from "next";
import { activityPages } from "@/data/activity-pages";
import { urlSite } from "@/lib/url-site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = urlSite();
  const maintenant = new Date();

  const pages: { chemin: string; priorite: number }[] = [
    { chemin: "", priorite: 1 },
    ...Object.keys(activityPages).map((slug) => ({ chemin: `/yoga/${slug}`, priorite: 0.9 })),
    { chemin: "/therapie-holistique", priorite: 0.9 },
    { chemin: "/cours-yoga-oloron", priorite: 0.9 },
    { chemin: "/cours-yoga-geronce", priorite: 0.9 },
    { chemin: "/reserver", priorite: 0.8 },
    { chemin: "/nous-contacter", priorite: 0.6 },
    { chemin: "/cgv", priorite: 0.3 },
    { chemin: "/mentions-legales", priorite: 0.3 },
    { chemin: "/confidentialite", priorite: 0.3 },
    { chemin: "/retractation", priorite: 0.3 },
  ];

  return pages.map((p) => ({
    url: `${base}${p.chemin}`,
    lastModified: maintenant,
    priority: p.priorite,
  }));
}
