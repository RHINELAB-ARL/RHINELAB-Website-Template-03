import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
  FullSlug,
} from "@quartz-community/types";
import { classNames } from "../util/lang";
import { joinSegments, pathToRoot, simplifySlug } from "@quartz-community/utils/path";
import { formatDate } from "@quartz-community/utils/date";
import style from "./styles/panel.scss";
// @ts-expect-error - inline script import handled by Quartz bundler
import script from "./scripts/panel.inline.ts";

export interface RhinelabPagePanelOptions {
  /** e.g. "https://github.com/ORG/REPO/edit/main/content/" — enables "Edit this page". */
  editBaseUrl?: string;
  /** e.g. "https://github.com/ORG/REPO/issues/new" — enables "Report an issue". */
  issuesUrl?: string;
  /** Slug prefixes that are not part of the reading order. */
  exclude?: string[];
  wordsPerMinute?: number;
  /** Mention the `t` filter key in the key hints (needs rhinelab-sidebar-tools). */
  showFilterKey?: boolean;
}

type FileLike = QuartzComponentProps["allFiles"][number];

interface Node {
  name: string;
  page?: FileLike;
  children: Map<string, Node>;
}

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

const titleOf = (f: FileLike | undefined, fallback: string) =>
  (f?.frontmatter?.title as string | undefined)?.trim() || fallback;

const label = (n: Node) => titleOf(n.page, n.name);

/** Mirrors the Explorer's default order: folders first, then natural order of labels. */
function readingOrder(files: FileLike[]): FileLike[] {
  const root: Node = { name: "", children: new Map() };
  for (const f of files) {
    const segs = (f.slug as string).split("/");
    const isIndex = segs[segs.length - 1] === "index";
    const path = isIndex ? segs.slice(0, -1) : segs;
    let node = root;
    for (const s of path) {
      let next = node.children.get(s);
      if (!next) node.children.set(s, (next = { name: s, children: new Map() }));
      node = next;
    }
    node.page = f;
  }
  const out: FileLike[] = [];
  const walk = (n: Node) => {
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

/** Words of prose: code, maths, HTML and link targets are left out. */
function countWords(text: string): number {
  const body = text
    .replace(/^---[\s\S]*?\n---\s*/, "")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$[^$\n]+\$/g, " ")
    .replace(/`[^`\n]*`/g, " ")
    .replace(/<[^>\n]+>/g, " ")
    .replace(/\]\([^)]*\)/g, "] ")
    .replace(/!?\[\[([^\]|]*\|)?([^\]]*)\]\]/g, "$2");
  return (body.match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu) ?? []).length;
}

function countSections(text: string): number {
  let inFence = false, n = 0;
  for (const line of text.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    else if (!inFence && /^##\s+\S/.test(line)) n++;
  }
  return n;
}

const svg = (paths: string) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: paths }} />
);
const I_EDIT = '<path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>';
const I_BUG = '<path d="m8 2 1.88 1.88"></path><path d="M14.12 3.88 16 2"></path><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"></path><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"></path><path d="M12 20v-9"></path><path d="M6.53 9C4.6 8.8 3 7.1 3 5"></path><path d="M6 13H2"></path><path d="M3 21c0-2.1 1.7-3.9 3.8-4"></path><path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"></path><path d="M22 13h-4"></path><path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"></path>';
const I_LINK = '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>';

export default ((opts?: RhinelabPagePanelOptions) => {
  const {
    editBaseUrl,
    issuesUrl,
    exclude = ["tags/", "404"],
    wordsPerMinute = 220,
    showFilterKey = true,
  } = opts ?? {};

  const Component: QuartzComponent = ({ fileData, allFiles, cfg, displayClass }: QuartzComponentProps) => {
    const slug = fileData.slug as FullSlug | undefined;
    if (!slug) return null;

    const pages = allFiles.filter(
      (f) =>
        f.slug &&
        f.filePath &&
        !exclude.some((p) => (f.slug as string) === p || (f.slug as string).startsWith(p)),
    );
    const order = readingOrder(pages);
    const i = order.findIndex((f) => f.slug === slug);
    const prev = i > 0 ? order[i - 1] : undefined;
    const next = i >= 0 && i < order.length - 1 ? order[i + 1] : undefined;

    const href = (f: FileLike) => joinSegments(pathToRoot(slug), simplifySlug(f.slug as FullSlug));
    const topic = (f: FileLike, dir: string, heading: string, which: string) => (
      <section class="mt-block">
        <h6>{heading}</h6>
        <a class="mt-topic internal" href={href(f)} data-mt-nav={which}>
          <span class="mt-dir">{dir}</span>
          <span>{titleOf(f, String(f.slug).split("/").pop() ?? "")}</span>
        </a>
      </section>
    );

    const text = (fileData.text as string | undefined) ?? "";
    const words = countWords(text);
    const sections = countSections(text);
    const modified = fileData.dates?.modified ? formatDate(fileData.dates.modified, cfg.locale) : undefined;

    const rel = ((fileData as Record<string, unknown>).relativePath as string | undefined) ??
      (fileData.filePath as string | undefined)?.replace(/^content\//, "");
    const editHref = editBaseUrl && rel ? editBaseUrl.replace(/\/?$/, "/") + rel : undefined;
    const issueHref = issuesUrl
      ? issuesUrl + (issuesUrl.includes("?") ? "&" : "?") + "title=" + encodeURIComponent(`Docs: ${titleOf(fileData, slug)}`)
      : undefined;

    return (
      <div class={classNames(displayClass, "mt-panel")}>
        {prev && topic(prev, "[", "Previous topic", "prev")}
        {next && topic(next, "]", "Next topic", "next")}

        <section class="mt-block">
          <h6>This page</h6>
          <ul>
            {editHref && (
              <li><a href={editHref} target="_blank" rel="noopener">{svg(I_EDIT)}Edit this page</a></li>
            )}
            {issueHref && (
              <li><a href={issueHref} target="_blank" rel="noopener">{svg(I_BUG)}Report an issue</a></li>
            )}
            <li>
              <button type="button" class="mt-linklike" data-mt-act="copy-link">
                {svg(I_LINK)}<span>Copy link</span>
              </button>
            </li>
          </ul>
        </section>

        {(words > 0 || modified) && (
          <section class="mt-block mt-meta">
            <h6>Page</h6>
            <dl>
              {modified && (<><dt>Modified</dt><dd>{modified}</dd></>)}
              {words > 0 && (
                <>
                  <dt>Length</dt>
                  <dd>{words.toLocaleString("en")} words · ~{Math.max(1, Math.round(words / wordsPerMinute))} min</dd>
                </>
              )}
              {sections > 0 && (<><dt>Sections</dt><dd>{sections}</dd></>)}
            </dl>
          </section>
        )}

        <div class="mt-keys">
          {showFilterKey && (<><kbd>t</kbd> filter · </>)}
          <kbd>[</kbd> <kbd>]</kbd> prev/next · <kbd>Ctrl</kbd> <kbd>K</kbd> search
        </div>
      </div>
    );
  };

  Component.css = style;
  Component.afterDOMLoaded = script;
  return Component;
}) satisfies QuartzComponentConstructor<RhinelabPagePanelOptions>;
