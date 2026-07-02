import type { APIRoute } from "astro";
import { getContentIndex } from "../lib/content";

// Static JSON of the content structure (topics, lessons, checklist lengths) so
// client islands can compute progress percentages without bundling content.
export const GET: APIRoute = async () => {
  const index = await getContentIndex();
  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
};
