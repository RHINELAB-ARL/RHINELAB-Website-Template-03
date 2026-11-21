/* RHINELAB sidebar tools for the Quartz 5 Explorer.
 * - filter box (terms are AND-ed, matches folder or page labels)
 * - expand all / collapse all / reveal current page
 * - `t` focuses the filter, Esc clears it, Enter opens the first match
 *
 * Everything is event-delegated, so the SPA router replacing the toolbar
 * (or the Explorer rebuilding its tree on every navigation) cannot unbind it.
 * Folder state is the Explorer's own: `.folder-outer.open`, persisted in
 * localStorage under "fileTree" as [{ path, collapsed }].
 */

// ── selectors (the only place that knows the Explorer's markup) ────────
const SEL = {
  tools: ".mt-tools",
  input: ".mt-filter-input",
  empty: ".mt-empty",
  ul: ".explorer-ul",
  item: "li:not(.overflow-end)",
  folderContainer: ".folder-container",
  folderOuter: ".folder-outer",
  folderTitle: ".folder-title",
  active: "a.active",
};
const STORE_KEY = "fileTree";

type Snapshot = Map<string, boolean>;
let filterValue = "";
let snapshot: Snapshot | null = null;
let observer: MutationObserver | null = null;
let pending = 0;

const clean = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
// Quartz augments Document.dispatchEvent, so Document is not assignable to ParentNode:
// take only the two methods we use.
type Root = Pick<ParentNode, "querySelector" | "querySelectorAll">;
const q = <T extends Element>(sel: string, root: Root = document) => root.querySelector<T>(sel);
const qa = <T extends Element>(sel: string, root: Root = document) => [...root.querySelectorAll<T>(sel)];
const isTyping = (t: EventTarget | null) => {
  const n = t as HTMLElement | null;
  return !!n && (n.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName));
};

const treeUl = () => q<HTMLElement>(SEL.ul);
const input = () => q<HTMLInputElement>(SEL.input);
const folderPath = (outer: Element) =>
  (outer.previousElementSibling as HTMLElement | null)?.dataset.folderpath ?? "";

// ── folder open/close (Explorer's own state) ───────────────────────────
function setOpen(outer: Element, open: boolean) {
  outer.classList.toggle("open", open);
  const icon = outer.previousElementSibling?.querySelector(".folder-icon");
  if (icon) icon.classList.toggle("open", open);
}

function persistAll(open: boolean) {
  try {
    const state = qa(SEL.folderOuter, treeUl() ?? document).map((o) => ({
      path: folderPath(o),
      collapsed: !open,
    }));
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable: state is simply not remembered */
  }
}

function openAncestors(node: Element) {
  let li = node.closest("li");
  while (li) {
    const outer = li.querySelector(`:scope > ${SEL.folderOuter}`);
    if (outer) setOpen(outer, true);
    li = li.parentElement?.closest("li") ?? null;
  }
}

// ── filter ─────────────────────────────────────────────────────────────
const labelOf = (li: HTMLElement) => {
  const file = li.querySelector<HTMLElement>(":scope > a");
  if (file) return clean(file.textContent).toLowerCase();
  const title = li.querySelector<HTMLElement>(`:scope > ${SEL.folderContainer} ${SEL.folderTitle}`);
  return clean(title?.textContent).toLowerCase();
};

function applyFilter() {
  const ul = treeUl();
  const empty = q<HTMLElement>(SEL.empty);
  if (!ul) return;
  const items = qa<HTMLElement>(SEL.item, ul);
  const terms = clean(filterValue).toLowerCase().split(" ").filter(Boolean);

  if (!terms.length) {
    items.forEach((li) => li.classList.remove("mt-hide", "mt-match"));
    if (snapshot) {
      qa(SEL.folderOuter, ul).forEach((o) => {
        const was = snapshot!.get(folderPath(o));
        if (was !== undefined) setOpen(o, was);
      });
      snapshot = null;
    }
    if (empty) empty.hidden = true;
    return;
  }

  if (!snapshot) {
    snapshot = new Map(qa(SEL.folderOuter, ul).map((o) => [folderPath(o), o.classList.contains("open")]));
  }
  items.forEach((li) => {
    li.classList.add("mt-hide");
    li.classList.remove("mt-match");
  });

  let hits = 0;
  items.forEach((li) => {
    const label = labelOf(li);
    if (!terms.every((t) => label.includes(t))) return;
    hits++;
    li.classList.remove("mt-hide");
    li.classList.add("mt-match");
    const own = li.querySelector(`:scope > ${SEL.folderOuter}`);
    if (own) {
      setOpen(own, true);
      qa<HTMLElement>(SEL.item, own).forEach((d) => d.classList.remove("mt-hide"));
    }
    let p = li.parentElement?.closest("li") ?? null;
    while (p) {
      p.classList.remove("mt-hide");
      const outer = p.querySelector(`:scope > ${SEL.folderOuter}`);
      if (outer) setOpen(outer, true);
      p = p.parentElement?.closest("li") ?? null;
    }
  });
  if (empty) empty.hidden = hits > 0;
}

// ── reveal current page ────────────────────────────────────────────────
function locate() {
  const a = q<HTMLAnchorElement>(SEL.active, treeUl() ?? document);
  if (!a) return;
  openAncestors(a);
  a.scrollIntoView({ block: "nearest", behavior: "smooth" });
  a.focus({ preventScroll: true });
}

// ── events (delegated, bound once) ─────────────────────────────────────
document.addEventListener("input", (e) => {
  const t = e.target as HTMLElement;
  if (!t.matches?.(SEL.input)) return;
  filterValue = (t as HTMLInputElement).value;
  applyFilter();
});

document.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest?.<HTMLElement>("[data-mt-act]");
  if (!btn || !btn.closest(SEL.tools)) return;
  const act = btn.dataset.mtAct;
  if (act === "locate") return locate();
  const open = act === "expand";
  const ul = treeUl();
  if (!ul) return;
  qa(SEL.folderOuter, ul).forEach((o) => setOpen(o, open));
  if (!open) {
    const a = q(SEL.active, ul);
    if (a) openAncestors(a);
  }
  persistAll(open);
});

document.addEventListener("keydown", (e) => {
  const t = e.target as HTMLElement;
  if (t.matches?.(SEL.input)) {
    const inp = t as HTMLInputElement;
    if (e.key === "Escape") {
      inp.value = "";
      filterValue = "";
      applyFilter();
      inp.blur();
    } else if (e.key === "Enter") {
      const first = q<HTMLAnchorElement>(`li.mt-match > a[href]`, treeUl() ?? document) ??
        q<HTMLAnchorElement>(`li.mt-match > ${SEL.folderContainer} a[href]`, treeUl() ?? document);
      if (first) {
        e.preventDefault();
        const url = new URL(first.href, location.href);
        typeof window.spaNavigate === "function" ? window.spaNavigate(url, false) : (location.href = url.href);
      }
    } else if (e.key === "ArrowDown") {
      const first = q<HTMLElement>(`li:not(.mt-hide) a[href]`, treeUl() ?? document);
      if (first) {
        e.preventDefault();
        first.focus();
      }
    }
    return;
  }

  // arrows move through the visible links of the tree
  if ((e.key === "ArrowDown" || e.key === "ArrowUp") && t.closest?.(SEL.ul)) {
    const links = qa<HTMLElement>("a[href]", treeUl()!).filter((a) => a.offsetParent !== null);
    const i = links.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    e.preventDefault();
    const j = e.key === "ArrowDown" ? Math.min(i + 1, links.length - 1) : i - 1;
    if (j < 0) input()?.focus();
    else links[j]?.focus();
    return;
  }

  // filter shortcut
  const key = q<HTMLElement>(SEL.tools)?.dataset.filterKey ?? "t";
  if (e.key === key && !e.defaultPrevented && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping(e.target)) {
    const inp = input();
    if (inp && inp.offsetParent !== null) {
      e.preventDefault();
      inp.focus();
      inp.select();
    }
  }
});

// ── per navigation: restore filter, re-apply after the Explorer renders ─
function watchTree() {
  observer?.disconnect();
  observer = null;
  const ul = treeUl();
  if (!ul) return;
  observer = new MutationObserver(() => {
    if (!filterValue || pending) return;
    pending = requestAnimationFrame(() => {
      pending = 0;
      applyFilter();
    });
  });
  observer.observe(ul, { childList: true, subtree: true });
}

function onNav() {
  const inp = input();
  if (inp && inp.value !== filterValue) inp.value = filterValue;
  snapshot = null; // the Explorer rebuilt the tree: old snapshot no longer matches
  watchTree();
  if (filterValue) applyFilter();
}

document.addEventListener("nav", onNav);
document.addEventListener("render", onNav as EventListener);
onNav();
