import { onFrame, onCleanup } from "./core"

/**
 * TopBar: hairline when scrolled, hides on scroll down, returns on scroll up.
 * The wordmark yields to the huge kinetic page title — hidden while the
 * title is on screen, sliding back once it's scrolled past.
 */

export function initTopBar(): void {
  const bar = document.querySelector<HTMLElement>("[data-topbar]")
  if (!bar) return

  const wordmark = bar.querySelector<HTMLElement>("[data-wordmark]")
  // Only the home hero is the brand rendered huge — yield to it there.
  // Everywhere else (articles, 404) the wordmark stays as the way home.
  const brandTitle = document.querySelector<HTMLElement>("[data-brand-title]")

  if (wordmark && brandTitle) {
    wordmark.classList.add("is-off")
    const io = new IntersectionObserver(
      ([entry]) => {
        wordmark.classList.toggle("is-off", entry.isIntersecting)
      },
      { rootMargin: "-56px 0px 0px 0px" }
    )
    io.observe(brandTitle)
    onCleanup(() => io.disconnect())
  }

  let lastY = window.scrollY

  onFrame(() => {
    const y = window.scrollY
    bar.classList.toggle("is-scrolled", y > 8)

    const goingDown = y > lastY + 4
    const goingUp = y < lastY - 4

    if (goingDown && y > 140) {
      bar.classList.add("is-hidden")
    } else if (goingUp || y <= 140) {
      bar.classList.remove("is-hidden")
    }

    if (goingDown || goingUp) lastY = y
  })
}
