<script lang="ts">
  import { onMount } from "svelte";
  import { appData, completeReview, ensureIndex } from "../lib/store";
  import { reviewCandidates, type ReviewCandidate } from "../lib/review";
  import type { ContentIndex, ReviewEase } from "../lib/types";
  import ReviewCard from "./ReviewCard.svelte";

  let index = $state<ContentIndex | null>(null);
  let result = $state<{ title: string; coins: number; xp: number; nextReview: string } | null>(null);

  onMount(() => {
    void ensureIndex().then((idx) => (index = idx));
  });

  const candidates = $derived<ReviewCandidate[]>(index ? reviewCandidates(index, $appData).filter((c) => c.due) : []);

  function handleReview(key: string, ease: ReviewEase) {
    const candidate = candidates.find((item) => item.key === key);
    const review = completeReview(key, ease);
    result = {
      title: candidate?.lessonTitle ?? "Lesson",
      coins: review.coins,
      xp: review.xp,
      nextReview: review.nextReview,
    };
  }
</script>

<section class="space-y-4">
  {#if result}
    <div class="rounded-md border border-complete bg-panel px-4 py-3 text-sm text-text-primary">
      Reviewed <span class="font-medium">{result.title}</span>. +{result.coins} coins, +{result.xp} XP. Next review {result.nextReview}.
    </div>
  {/if}

  {#if !index}
    <p class="rounded-md border border-line bg-panel px-4 py-6 text-center text-sm text-text-muted">Loading reviews…</p>
  {:else if candidates.length === 0}
    <p class="rounded-md border border-dashed border-line px-4 py-8 text-center text-sm text-text-muted">
      No reviews due. Complete lessons first, or come back when scheduled reviews are due.
    </p>
  {:else}
    <div class="grid gap-3 md:grid-cols-2">
      {#each candidates as candidate (candidate.key)}
        <ReviewCard {candidate} onReview={handleReview} />
      {/each}
    </div>
  {/if}
</section>
