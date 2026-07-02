// Display formatters. All locale-aware output is normalized to plain spaces so
// it renders and tests consistently across ICU versions (which may use NBSP
// U+00A0 or narrow NBSP U+202F as separators).

const NBSP = /[  ]/g;

const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** e.g. rupiah(20000) -> "Rp 20.000" */
export function rupiah(amount: number): string {
  return idrFormatter.format(amount).replace(NBSP, " ");
}

/** Fraction (0..1) -> rounded whole percent. pct(0.676) -> 68 */
export function pct(fraction: number): number {
  return Math.round(fraction * 100);
}

/** ISO date string -> localized short date, e.g. "26 Jun 2026". */
export function dateID(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return dateFormatter.format(d).replace(NBSP, " ");
}
