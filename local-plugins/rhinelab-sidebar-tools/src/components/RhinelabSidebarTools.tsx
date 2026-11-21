import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";
import { classNames } from "../util/lang";
import style from "./styles/tools.scss";
// @ts-expect-error - inline script import handled by Quartz bundler
import script from "./scripts/tools.inline.ts";

export interface RhinelabSidebarToolsOptions {
  /** Placeholder of the filter box. */
  placeholder?: string;
  /** Key that focuses the filter box (outside text fields). Default "t". */
  filterKey?: string;
}

const svg = (paths: string) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    dangerouslySetInnerHTML={{ __html: paths }}
  />
);

const ICON_FILTER = '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>';
const ICON_EXPAND =
  '<path d="M12 22v-6"></path><path d="M12 8V2"></path><path d="M4 12H2"></path><path d="M10 12H8"></path><path d="M16 12h-2"></path><path d="M22 12h-2"></path><path d="m15 19-3 3-3-3"></path><path d="m15 5-3-3-3 3"></path>';
const ICON_COLLAPSE =
  '<path d="M12 22v-6"></path><path d="M12 8V2"></path><path d="M4 12H2"></path><path d="M10 12H8"></path><path d="M16 12h-2"></path><path d="M22 12h-2"></path><path d="m15 19-3-3-3 3"></path><path d="m15 5-3 3-3-3"></path>';
const ICON_LOCATE =
  '<circle cx="12" cy="12" r="10"></circle><line x1="22" x2="18" y1="12" y2="12"></line><line x1="6" x2="2" y1="12" y2="12"></line><line x1="12" x2="12" y1="6" y2="2"></line><line x1="12" x2="12" y1="22" y2="18"></line>';

export default ((opts?: RhinelabSidebarToolsOptions) => {
  const { placeholder = "Filter pages", filterKey = "t" } = opts ?? {};

  const Component: QuartzComponent = ({ displayClass }: QuartzComponentProps) => (
    <div class={classNames(displayClass, "mt-tools")} data-filter-key={filterKey}>
      <div class="mt-toolbar" role="toolbar" aria-label="Navigation tools">
        <label class="mt-filter">
          {svg(ICON_FILTER)}
          <input
            type="search"
            class="mt-filter-input"
            placeholder={placeholder}
            aria-label="Filter navigation"
            autocomplete="off"
            spellcheck={false}
          />
          <kbd>{filterKey}</kbd>
        </label>
        <button type="button" class="mt-btn" data-mt-act="expand" title="Expand all" aria-label="Expand all">
          {svg(ICON_EXPAND)}
        </button>
        <button type="button" class="mt-btn" data-mt-act="collapse" title="Collapse all" aria-label="Collapse all">
          {svg(ICON_COLLAPSE)}
        </button>
        <button type="button" class="mt-btn" data-mt-act="locate" title="Reveal current page" aria-label="Reveal current page">
          {svg(ICON_LOCATE)}
        </button>
      </div>
      <div class="mt-empty" hidden>
        no matching pages
      </div>
    </div>
  );

  Component.css = style;
  Component.afterDOMLoaded = script;
  return Component;
}) satisfies QuartzComponentConstructor;
