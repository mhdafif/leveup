export function fuzzyMatchIndices(title: string, query: string): number[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  const matched: number[] = [];
  let queryIndex = 0;

  for (let titleIndex = 0; titleIndex < title.length && queryIndex < needle.length; titleIndex += 1) {
    if (title[titleIndex].toLowerCase() === needle[queryIndex]) {
      matched.push(titleIndex);
      queryIndex += 1;
    }
  }

  return queryIndex === needle.length ? matched : [];
}
