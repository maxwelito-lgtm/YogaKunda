import type { MetadataRoute } from "next";
import { urlSite } from "@/lib/url-site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/auth/", "/mon-espace", "/connexion", "/inscription", "/mot-de-passe-oublie", "/nouveau-mot-de-passe"],
    },
    sitemap: `${urlSite()}/sitemap.xml`,
  };
}
