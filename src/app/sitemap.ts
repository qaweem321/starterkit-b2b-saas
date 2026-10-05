import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";

// Public pages for search engines. Add your marketing pages here.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/signup"), changeFrequency: "yearly", priority: 0.5 },
    { url: absoluteUrl("/login"), changeFrequency: "yearly", priority: 0.3 },
  ];
}
