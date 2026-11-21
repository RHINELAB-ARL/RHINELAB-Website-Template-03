import { QuartzComponent } from '@quartz-community/types';

interface RhinelabPagePanelOptions {
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
declare const _default: (opts?: RhinelabPagePanelOptions) => QuartzComponent;

export { _default as RhinelabPagePanel, type RhinelabPagePanelOptions };
