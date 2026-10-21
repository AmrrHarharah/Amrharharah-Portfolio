import type { MetadataRoute } from "next";
import { me, projects } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: me.siteUrl }, ...projects.map((p) => ({ url: `${me.siteUrl}/proyek/${p.slug}` }))]; }
