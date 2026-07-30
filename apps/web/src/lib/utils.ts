export const img = (url: string, w: number) => `${url}?w=${w}&auto=format&q=85`

export const srcset = (url: string, widths: number[]) =>
  widths.map((w) => `${img(url, w)} ${w}w`).join(", ")

/** Date-only strings ("2026-06-25") parse as UTC midnight — which is the
    previous day in negative timezones. Anchor at local noon instead. */
const parseDate = (date: string) =>
  new Date(date.includes("T") ? date : `${date}T12:00:00`)

export const formatDate = (date: string) =>
  parseDate(date).toLocaleDateString("pt-BR", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

export const formatDateLong = (date: string) =>
  parseDate(date).toLocaleDateString("pt-BR", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

interface TextBlock {
  _type?: string
  children?: { text?: string }[]
}

export function readingTime(blocks: TextBlock[]): number {
  const words = blocks
    .filter((b) => b._type !== "image")
    .flatMap((b) => b.children ?? [])
    .map((c) => c.text ?? "")
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
