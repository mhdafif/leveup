<script lang="ts">
  import type { ReviewCandidate } from "../lib/review";
  import type { ReviewEase } from "../lib/types";

  let {
    candidate,
    onReview,
  }: {
    candidate: ReviewCandidate;
    onReview: (key: string, ease: ReviewEase) => void;
  } = $props();

  const options: { ease: ReviewEase; label: string; tone: string }[] = [
    { ease: "hard", label: "Hard", tone: "border-urgency text-urgency" },
    { ease: "good", label: "Good", tone: "border-active text-active" },
    { ease: "easy", label: "Easy", tone: "border-complete text-complete" },
  ];
</script>

<article class="rounded-md border border-line bg-panel p-4">
  <div class="flex flex-wrap items-start justify-between gap-3">
    <div>
      <p class="font-data text-xs tracking-widest text-text-muted uppercase">{candidate.topicTitle}</p>
      <h2 class="mt-1 text-lg font-semibold text-text-primary">{candidate.lessonTitle}</h2>
      <p class="mt-1 text-sm text-text-muted">
        {candidate.reviewCount} review{candidate.reviewCount === 1 ? "" : "s"}
        {#if candidate.lastReviewed} · last {candidate.lastReviewed}{/if}
      </p>
    </div>
    <span class="rounded-full bg-active-soft px-2.5 py-1 font-data text-xs text-active">
      {candidate.due ? "Due" : `Next ${candidate.nextReview}`}
    </span>
  </div>

  <div class="mt-4 flex flex-wrap gap-2">
    {#each options as option}
      <button
        type="button"
        onclick={() => onReview(candidate.key, option.ease)}
        class={`rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-panel-soft ${option.tone}`}
      >
        {option.label}
      </button>
    {/each}
  </div>
</article>
