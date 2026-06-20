import type { MetadataRoute } from "next";

const BASE_URL = "https://kaiat.co.kr";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/courses", priority: 0.9, changeFrequency: "daily" },
    { path: "/exams", priority: 0.9, changeFrequency: "daily" },
    { path: "/certificates", priority: 0.8, changeFrequency: "weekly" },
    { path: "/certificates/verify", priority: 0.7, changeFrequency: "monthly" },
    { path: "/showcase", priority: 0.7, changeFrequency: "weekly" },
    { path: "/inquiries", priority: 0.5, changeFrequency: "monthly" },
    { path: "/auth/login", priority: 0.4, changeFrequency: "yearly" },
    { path: "/auth/register", priority: 0.4, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  ];

  return routes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
