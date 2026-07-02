// Tiny window-event bus so islands can signal global UI (confetti, toasts)
// without sharing a component tree.

export interface CelebrateDetail {
  intensity?: "lesson" | "topic";
}

export interface ToastDetail {
  icon?: string;
  title: string;
  message?: string;
}

const CELEBRATE = "levelup:celebrate";
const TOAST = "levelup:toast";

export function celebrate(detail: CelebrateDetail = {}): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CELEBRATE, { detail }));
  }
}

export function toast(detail: ToastDetail): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(TOAST, { detail }));
  }
}

export function onCelebrate(handler: (d: CelebrateDetail) => void): () => void {
  const fn = (e: Event) => handler((e as CustomEvent<CelebrateDetail>).detail ?? {});
  window.addEventListener(CELEBRATE, fn);
  return () => window.removeEventListener(CELEBRATE, fn);
}

export function onToast(handler: (d: ToastDetail) => void): () => void {
  const fn = (e: Event) => handler((e as CustomEvent<ToastDetail>).detail);
  window.addEventListener(TOAST, fn);
  return () => window.removeEventListener(TOAST, fn);
}
