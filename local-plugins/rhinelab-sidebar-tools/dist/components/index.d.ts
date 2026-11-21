import { QuartzComponent } from '@quartz-community/types';

interface RhinelabSidebarToolsOptions {
    /** Placeholder of the filter box. */
    placeholder?: string;
    /** Key that focuses the filter box (outside text fields). Default "t". */
    filterKey?: string;
}
declare const _default: (opts?: RhinelabSidebarToolsOptions) => QuartzComponent;

export { _default as RhinelabSidebarTools, type RhinelabSidebarToolsOptions };
