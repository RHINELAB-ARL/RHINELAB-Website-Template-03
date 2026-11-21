/* RHINELAB page panel: `[` / `]` go to the previous / next topic, and the
 * "Copy link" button. Delegated, so SPA navigation needs no re-binding. */

const isTyping = (t: EventTarget | null) => {
  const n = t as HTMLElement | null;
  return !!n && (n.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName));
};

function go(which: "prev" | "next") {
  const a = document.querySelector<HTMLAnchorElement>(`.mt-panel [data-mt-nav="${which}"]`);
  if (!a) return;
  const url = new URL(a.href, location.href);
  typeof window.spaNavigate === "function" ? window.spaNavigate(url, false) : (location.href = url.href);
}

document.addEventListener("keydown", (e) => {
  if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
  if (e.key === "[") {
    e.preventDefault();
    go("prev");
  } else if (e.key === "]") {
    e.preventDefault();
    go("next");
  }
});

document.addEventListener("click", async (e) => {
  const btn = (e.target as HTMLElement).closest?.<HTMLElement>('[data-mt-act="copy-link"]');
  if (!btn) return;
  const span = btn.querySelector("span");
  if (!span) return;
  try {
    await navigator.clipboard.writeText(location.href.split("#")[0] ?? location.href);
    span.textContent = "Copied";
  } catch {
    span.textContent = "Copy failed";
  }
  setTimeout(() => (span.textContent = "Copy link"), 1400);
});
