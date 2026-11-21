import { createRequire } from 'module';
import { jsxs, jsx, Fragment } from 'preact/jsx-runtime';

createRequire(import.meta.url);

// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
function simplifySlug(fp) {
  const res = stripSlashes(trimSuffix(fp, "index"), true);
  return res.length === 0 ? "/" : res;
}
function joinSegments(...args) {
  if (args.length === 0) {
    return "";
  }
  let joined = args.filter((segment) => segment !== "" && segment !== "/").map((segment) => stripSlashes(segment)).join("/");
  const first = args[0];
  const last = args[args.length - 1];
  if (first?.startsWith("/")) {
    joined = "/" + joined;
  }
  if (last?.endsWith("/")) {
    joined = joined + "/";
  }
  return joined;
}
function endsWith(s, suffix) {
  return s === suffix || s.endsWith("/" + suffix);
}
function trimSuffix(s, suffix) {
  if (endsWith(s, suffix)) {
    s = s.slice(0, -suffix.length);
  }
  return s;
}
function stripSlashes(s, onlyStripPrefix) {
  if (s.startsWith("/")) {
    s = s.substring(1);
  }
  if (!onlyStripPrefix && s.endsWith("/")) {
    s = s.slice(0, -1);
  }
  return s;
}
function pathToRoot(slug2) {
  let rootPath = slug2.split("/").filter((x) => x !== "").slice(0, -1).map((_) => "..").join("/");
  if (rootPath.length === 0) {
    rootPath = ".";
  }
  return rootPath;
}

// node_modules/@quartz-community/utils/dist/date.js
function formatDate(d, locale = "en-US") {
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit"
  });
}

// src/components/styles/panel.scss
var panel_default = ".mt-panel {\n  margin-top: 1.4rem;\n  padding-top: 1rem;\n  border-top: 1px solid var(--mt-rule, var(--lightgray));\n  font-size: 0.8rem;\n}\n.mt-panel .mt-block {\n  margin: 0 0 1rem;\n}\n.mt-panel h6 {\n  margin: 0 0 0.35rem;\n  font-family: var(--codeFont);\n  font-size: 0.66rem;\n  font-weight: 600;\n  letter-spacing: 0.09em;\n  text-transform: uppercase;\n  color: var(--mt-faint, var(--gray));\n}\n.mt-panel ul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n.mt-panel li {\n  margin: 0.1rem 0;\n}\n.mt-panel a,\n.mt-panel .mt-linklike {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.45rem;\n  padding: 0;\n  border: 0;\n  background: none;\n  font: inherit;\n  color: var(--mt-fg, var(--darkgray));\n  cursor: pointer;\n  text-decoration: none;\n  transition: color 0.12s;\n}\n.mt-panel a svg,\n.mt-panel .mt-linklike svg {\n  flex: none;\n  color: var(--mt-faint, var(--gray));\n  transition: color 0.12s;\n}\n.mt-panel a:hover,\n.mt-panel .mt-linklike:hover {\n  color: var(--mt-link, var(--secondary));\n}\n.mt-panel a:hover svg,\n.mt-panel .mt-linklike:hover svg {\n  color: inherit;\n}\n.mt-panel a.mt-topic {\n  align-items: baseline;\n  background: none;\n  line-height: 1.35;\n}\n.mt-panel a.mt-topic .mt-dir {\n  flex: none;\n  font-family: var(--codeFont);\n  font-size: 0.7rem;\n  min-width: 1.1rem;\n  text-align: center;\n  padding: 0 0.2rem;\n  border: 1px solid var(--mt-rule-strong, var(--lightgray));\n  border-radius: 2px;\n  color: var(--mt-muted, var(--gray));\n}\n.mt-panel .mt-meta dl {\n  display: grid;\n  grid-template-columns: auto 1fr;\n  gap: 0.15rem 0.7rem;\n  margin: 0;\n}\n.mt-panel .mt-meta dl dt {\n  color: var(--mt-faint, var(--gray));\n}\n.mt-panel .mt-meta dl dd {\n  margin: 0;\n  color: var(--mt-fg, var(--darkgray));\n  font-variant-numeric: tabular-nums;\n}\n.mt-panel .mt-keys {\n  font-size: 0.7rem;\n  line-height: 1.9;\n  color: var(--mt-faint, var(--gray));\n}\n.mt-panel .mt-keys kbd {\n  font-family: var(--codeFont);\n  font-size: 0.66rem;\n  padding: 0.08rem 0.32rem;\n  border: 1px solid var(--mt-rule-strong, var(--lightgray));\n  border-bottom-width: 2px;\n  border-radius: 2px;\n  background: var(--mt-surface, var(--lightgray));\n  color: var(--mt-muted, var(--gray));\n}";

// src/components/scripts/panel.inline.ts
var panel_inline_default = 'var o=t=>{let e=t;return!!e&&(e.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName))};function a(t){let e=document.querySelector(`.mt-panel [data-mt-nav="${t}"]`);if(!e)return;let n=new URL(e.href,location.href);typeof window.spaNavigate=="function"?window.spaNavigate(n,!1):location.href=n.href}document.addEventListener("keydown",t=>{t.defaultPrevented||t.ctrlKey||t.metaKey||t.altKey||o(t.target)||(t.key==="["?(t.preventDefault(),a("prev")):t.key==="]"&&(t.preventDefault(),a("next")))});document.addEventListener("click",async t=>{let e=t.target.closest?.(\'[data-mt-act="copy-link"]\');if(!e)return;let n=e.querySelector("span");if(n){try{await navigator.clipboard.writeText(location.href.split("#")[0]??location.href),n.textContent="Copied"}catch{n.textContent="Copy failed"}setTimeout(()=>n.textContent="Copy link",1400)}});\n';
var collator = new Intl.Collator(void 0, { numeric: true, sensitivity: "base" });
var titleOf = (f, fallback) => f?.frontmatter?.title?.trim() || fallback;
var label = (n) => titleOf(n.page, n.name);
function readingOrder(files) {
  const root = { children: /* @__PURE__ */ new Map() };
  for (const f of files) {
    const segs = f.slug.split("/");
    const isIndex = segs[segs.length - 1] === "index";
    const path = isIndex ? segs.slice(0, -1) : segs;
    let node = root;
    for (const s of path) {
      let next = node.children.get(s);
      if (!next) node.children.set(s, next = { name: s, children: /* @__PURE__ */ new Map() });
      node = next;
    }
    node.page = f;
  }
  const out = [];
  const walk = (n) => {
    if (n.page) out.push(n.page);
    const kids = [...n.children.values()].sort((a, b) => {
      const af = a.children.size > 0, bf = b.children.size > 0;
      if (af !== bf) return af ? -1 : 1;
      return collator.compare(label(a), label(b));
    });
    kids.forEach(walk);
  };
  walk(root);
  return out;
}
function countWords(text) {
  const body = text.replace(/^---[\s\S]*?\n---\s*/, "").replace(/```[\s\S]*?```/g, " ").replace(/~~~[\s\S]*?~~~/g, " ").replace(/\$\$[\s\S]*?\$\$/g, " ").replace(/\$[^$\n]+\$/g, " ").replace(/`[^`\n]*`/g, " ").replace(/<[^>\n]+>/g, " ").replace(/\]\([^)]*\)/g, "] ").replace(/!?\[\[([^\]|]*\|)?([^\]]*)\]\]/g, "$2");
  return (body.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length;
}
function countSections(text) {
  let inFence = false, n = 0;
  for (const line of text.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    else if (!inFence && /^##\s+\S/.test(line)) n++;
  }
  return n;
}
var svg = (paths) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "aria-hidden": "true",
    dangerouslySetInnerHTML: { __html: paths }
  }
);
var I_EDIT = '<path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>';
var I_BUG = '<path d="m8 2 1.88 1.88"></path><path d="M14.12 3.88 16 2"></path><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"></path><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"></path><path d="M12 20v-9"></path><path d="M6.53 9C4.6 8.8 3 7.1 3 5"></path><path d="M6 13H2"></path><path d="M3 21c0-2.1 1.7-3.9 3.8-4"></path><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"></path><path d="M22 13h-4"></path><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"></path>';
var I_LINK = '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>';
var RhinelabPagePanel_default = ((opts) => {
  const {
    editBaseUrl,
    issuesUrl,
    exclude = ["tags/", "404"],
    wordsPerMinute = 220,
    showFilterKey = true
  } = opts ?? {};
  const Component = ({ fileData, allFiles, cfg, displayClass }) => {
    const slug = fileData.slug;
    if (!slug) return null;
    const pages = allFiles.filter(
      (f) => f.slug && f.filePath && !exclude.some((p) => f.slug === p || f.slug.startsWith(p))
    );
    const order = readingOrder(pages);
    const i = order.findIndex((f) => f.slug === slug);
    const prev = i > 0 ? order[i - 1] : void 0;
    const next = i >= 0 && i < order.length - 1 ? order[i + 1] : void 0;
    const href = (f) => joinSegments(pathToRoot(slug), simplifySlug(f.slug));
    const topic = (f, dir, heading, which) => /* @__PURE__ */ jsxs("section", { class: "mt-block", children: [
      /* @__PURE__ */ jsx("h6", { children: heading }),
      /* @__PURE__ */ jsxs("a", { class: "mt-topic internal", href: href(f), "data-mt-nav": which, children: [
        /* @__PURE__ */ jsx("span", { class: "mt-dir", children: dir }),
        /* @__PURE__ */ jsx("span", { children: titleOf(f, String(f.slug).split("/").pop() ?? "") })
      ] })
    ] });
    const text = fileData.text ?? "";
    const words = countWords(text);
    const sections = countSections(text);
    const modified = fileData.dates?.modified ? formatDate(fileData.dates.modified, cfg.locale) : void 0;
    const rel = fileData.relativePath ?? fileData.filePath?.replace(/^content\//, "");
    const editHref = editBaseUrl && rel ? editBaseUrl.replace(/\/?$/, "/") + rel : void 0;
    const issueHref = issuesUrl ? issuesUrl + (issuesUrl.includes("?") ? "&" : "?") + "title=" + encodeURIComponent(`Docs: ${titleOf(fileData, slug)}`) : void 0;
    return /* @__PURE__ */ jsxs("div", { class: classNames(displayClass, "mt-panel"), children: [
      prev && topic(prev, "[", "Previous topic", "prev"),
      next && topic(next, "]", "Next topic", "next"),
      /* @__PURE__ */ jsxs("section", { class: "mt-block", children: [
        /* @__PURE__ */ jsx("h6", { children: "This page" }),
        /* @__PURE__ */ jsxs("ul", { children: [
          editHref && /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", { href: editHref, target: "_blank", rel: "noopener", children: [
            svg(I_EDIT),
            "Edit this page"
          ] }) }),
          issueHref && /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("a", { href: issueHref, target: "_blank", rel: "noopener", children: [
            svg(I_BUG),
            "Report an issue"
          ] }) }),
          /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs("button", { type: "button", class: "mt-linklike", "data-mt-act": "copy-link", children: [
            svg(I_LINK),
            /* @__PURE__ */ jsx("span", { children: "Copy link" })
          ] }) })
        ] })
      ] }),
      (words > 0 || modified) && /* @__PURE__ */ jsxs("section", { class: "mt-block mt-meta", children: [
        /* @__PURE__ */ jsx("h6", { children: "Page" }),
        /* @__PURE__ */ jsxs("dl", { children: [
          modified && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("dt", { children: "Modified" }),
            /* @__PURE__ */ jsx("dd", { children: modified })
          ] }),
          words > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("dt", { children: "Length" }),
            /* @__PURE__ */ jsxs("dd", { children: [
              words.toLocaleString("en"),
              " words \xB7 ~",
              Math.max(1, Math.round(words / wordsPerMinute)),
              " min"
            ] })
          ] }),
          sections > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("dt", { children: "Sections" }),
            /* @__PURE__ */ jsx("dd", { children: sections })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { class: "mt-keys", children: [
        showFilterKey && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("kbd", { children: "t" }),
          " filter \xB7 "
        ] }),
        /* @__PURE__ */ jsx("kbd", { children: "[" }),
        " ",
        /* @__PURE__ */ jsx("kbd", { children: "]" }),
        " prev/next \xB7 ",
        /* @__PURE__ */ jsx("kbd", { children: "Ctrl" }),
        " ",
        /* @__PURE__ */ jsx("kbd", { children: "K" }),
        " search"
      ] })
    ] });
  };
  Component.css = panel_default;
  Component.afterDOMLoaded = panel_inline_default;
  return Component;
});

export { RhinelabPagePanel_default as RhinelabPagePanel };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map