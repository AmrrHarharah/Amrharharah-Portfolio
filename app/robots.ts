import type { MetadataRoute } from "next";
import { me } from "@/lib/site";
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: "*", allow: "/" }, sitemap: `${me.siteUrl}/sitemap.xml` }; }
