<script lang="ts">
  import { onMount } from "svelte";
  import { ensureIndex } from "../lib/store";
  import LessonDrawer from "./LessonDrawer.svelte";
  import type { LessonMeta } from "../lib/types";

  // Intercepts clicks on internal /topics/<topic>/<lesson> links inside the
  // roadmap phase pages and opens them in a slide-over drawer instead of navigating.

  let drawerOpen = $state(false);
  let drawerTopic = $state("");
  let drawerLesson = $state("");
  let drawerMeta = $state<LessonMeta | null>(null);

  async function openDrawer(topicSlug: string, lessonSlug: string) {
    const index = await ensureIndex();
    const topic = index.topics.find((t) => t.slug === topicSlug);
    const lesson = topic?.lessons.find((l) => l.slug === lessonSlug) ?? null;
    drawerTopic = topicSlug;
    drawerLesson = lessonSlug;
    drawerMeta = lesson;
    drawerOpen = true;
  }

  onMount(() => {
    const article = document.querySelector("article[data-pagefind-body]");
    if (!article) return;

    function handleClick(e: Event) {
      const target = (e.target as HTMLElement).closest("a[href]");
      if (!target) return;
      const href = (target as HTMLAnchorElement).getAttribute("href") ?? "";
      // Match /topics/<topicSlug>/<lessonSlug>
      const m = href.match(/^\/topics\/([^/]+)\/([^/]+)\/?$/);
      if (!m) return;
      e.preventDefault();
      openDrawer(m[1], m[2]);
    }

    article.addEventListener("click", handleClick);
    return () => article.removeEventListener("click", handleClick);
  });
</script>

<LessonDrawer
  open={drawerOpen}
  topicSlug={drawerTopic}
  lessonSlug={drawerLesson}
  lessonTitle={drawerMeta?.title ?? ""}
  checklist={drawerMeta?.checklist ?? []}
  difficulty={drawerMeta?.difficulty}
  estMinutes={drawerMeta?.estMinutes}
  onClose={() => (drawerOpen = false)}
/>
