import { createRequire } from 'module';
import { jsxs, jsx } from 'preact/jsx-runtime';

createRequire(import.meta.url);

// node_modules/@quartz-community/utils/dist/lang.js
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

// src/components/styles/tools.scss
var tools_default = ".mt-tools {\n  margin: 0 0 0.6rem;\n}\n.mt-tools .mt-toolbar {\n  display: flex;\n  align-items: stretch;\n  gap: 0.3rem;\n}\n.mt-tools .mt-filter {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  padding: 0 0.5rem;\n  height: 1.9rem;\n  border: 1px solid var(--mt-rule-strong, var(--lightgray));\n  border-radius: 2px;\n  background: var(--mt-bg, var(--light));\n  color: var(--mt-muted, var(--gray));\n  cursor: text;\n  transition: border-color 0.12s, box-shadow 0.12s;\n}\n.mt-tools .mt-filter:focus-within {\n  border-color: var(--mt-link, var(--secondary));\n  box-shadow: 0 0 0 2px color-mix(in srgb, var(--mt-link, var(--secondary)) 18%, transparent);\n}\n.mt-tools .mt-filter svg {\n  flex: none;\n}\n.mt-tools .mt-filter input {\n  flex: 1;\n  min-width: 0;\n  border: 0;\n  outline: 0;\n  background: transparent;\n  color: var(--mt-fg, var(--darkgray));\n  font: inherit;\n  font-size: 0.8rem;\n  padding: 0;\n  appearance: none;\n}\n.mt-tools .mt-filter input::-webkit-search-cancel-button {\n  display: none;\n}\n.mt-tools .mt-filter input::placeholder {\n  color: var(--mt-faint, var(--gray));\n}\n.mt-tools .mt-filter kbd {\n  flex: none;\n  font-family: var(--codeFont);\n  font-size: 0.66rem;\n  line-height: 1;\n  padding: 0.12rem 0.34rem;\n  border: 1px solid var(--mt-rule-strong, var(--lightgray));\n  border-bottom-width: 2px;\n  border-radius: 2px;\n  background: var(--mt-surface, var(--lightgray));\n  color: var(--mt-muted, var(--gray));\n}\n.mt-tools .mt-btn {\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 1.9rem;\n  height: 1.9rem;\n  padding: 0;\n  border: 1px solid var(--mt-rule-strong, var(--lightgray));\n  border-radius: 2px;\n  background: var(--mt-bg, var(--light));\n  color: var(--mt-muted, var(--gray));\n  cursor: pointer;\n  transition: color 0.12s, border-color 0.12s, background 0.12s;\n}\n.mt-tools .mt-btn:hover {\n  color: var(--mt-link, var(--secondary));\n  border-color: var(--mt-link, var(--secondary));\n  background: var(--mt-surface, var(--lightgray));\n}\n.mt-tools .mt-btn:focus-visible {\n  outline: 2px solid var(--mt-link, var(--secondary));\n  outline-offset: 1px;\n}\n.mt-tools .mt-empty {\n  margin: 0.5rem 0.2rem 0;\n  font-size: 0.78rem;\n  font-style: italic;\n  color: var(--mt-faint, var(--gray));\n}\n\n.explorer-ul li.mt-hide {\n  display: none;\n}\n.explorer-ul li.mt-match > a,\n.explorer-ul li.mt-match > .folder-container .folder-title {\n  background: color-mix(in srgb, var(--mt-teal, var(--tertiary)) 16%, transparent);\n  border-radius: 2px;\n}";

// src/components/scripts/tools.inline.ts
var tools_inline_default = 'var o={tools:".mt-tools",input:".mt-filter-input",empty:".mt-empty",ul:".explorer-ul",item:"li:not(.overflow-end)",folderContainer:".folder-container",folderOuter:".folder-outer",folderTitle:".folder-title",active:"a.active"},S="fileTree",u="",d=null,h=null,T=0,y=e=>(e??"").replace(/\\s+/g," ").trim(),i=(e,t=document)=>t.querySelector(e),a=(e,t=document)=>[...t.querySelectorAll(e)],b=e=>{let t=e;return!!t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))},c=()=>i(o.ul),M=()=>i(o.input),g=e=>e.previousElementSibling?.dataset.folderpath??"";function E(e,t){e.classList.toggle("open",t);let l=e.previousElementSibling?.querySelector(".folder-icon");l&&l.classList.toggle("open",t)}function A(e){try{let t=a(o.folderOuter,c()??document).map(l=>({path:g(l),collapsed:!e}));localStorage.setItem(S,JSON.stringify(t))}catch{}}function H(e){let t=e.closest("li");for(;t;){let l=t.querySelector(`:scope > ${o.folderOuter}`);l&&E(l,!0),t=t.parentElement?.closest("li")??null}}var O=e=>{let t=e.querySelector(":scope > a");if(t)return y(t.textContent).toLowerCase();let l=e.querySelector(`:scope > ${o.folderContainer} ${o.folderTitle}`);return y(l?.textContent).toLowerCase()};function L(){let e=c(),t=i(o.empty);if(!e)return;let l=a(o.item,e),r=y(u).toLowerCase().split(" ").filter(Boolean);if(!r.length){l.forEach(n=>n.classList.remove("mt-hide","mt-match")),d&&(a(o.folderOuter,e).forEach(n=>{let f=d.get(g(n));f!==void 0&&E(n,f)}),d=null),t&&(t.hidden=!0);return}d||(d=new Map(a(o.folderOuter,e).map(n=>[g(n),n.classList.contains("open")]))),l.forEach(n=>{n.classList.add("mt-hide"),n.classList.remove("mt-match")});let s=0;l.forEach(n=>{let f=O(n);if(!r.every(m=>f.includes(m)))return;s++,n.classList.remove("mt-hide"),n.classList.add("mt-match");let v=n.querySelector(`:scope > ${o.folderOuter}`);v&&(E(v,!0),a(o.item,v).forEach(m=>m.classList.remove("mt-hide")));let p=n.parentElement?.closest("li")??null;for(;p;){p.classList.remove("mt-hide");let m=p.querySelector(`:scope > ${o.folderOuter}`);m&&E(m,!0),p=p.parentElement?.closest("li")??null}}),t&&(t.hidden=s>0)}function k(){let e=i(o.active,c()??document);e&&(H(e),e.scrollIntoView({block:"nearest",behavior:"smooth"}),e.focus({preventScroll:!0}))}document.addEventListener("input",e=>{let t=e.target;t.matches?.(o.input)&&(u=t.value,L())});document.addEventListener("click",e=>{let t=e.target.closest?.("[data-mt-act]");if(!t||!t.closest(o.tools))return;let l=t.dataset.mtAct;if(l==="locate")return k();let r=l==="expand",s=c();if(s){if(a(o.folderOuter,s).forEach(n=>E(n,r)),!r){let n=i(o.active,s);n&&H(n)}A(r)}});document.addEventListener("keydown",e=>{let t=e.target;if(t.matches?.(o.input)){let r=t;if(e.key==="Escape")r.value="",u="",L(),r.blur();else if(e.key==="Enter"){let s=i("li.mt-match > a[href]",c()??document)??i(`li.mt-match > ${o.folderContainer} a[href]`,c()??document);if(s){e.preventDefault();let n=new URL(s.href,location.href);typeof window.spaNavigate=="function"?window.spaNavigate(n,!1):location.href=n.href}}else if(e.key==="ArrowDown"){let s=i("li:not(.mt-hide) a[href]",c()??document);s&&(e.preventDefault(),s.focus())}return}if((e.key==="ArrowDown"||e.key==="ArrowUp")&&t.closest?.(o.ul)){let r=a("a[href]",c()).filter(f=>f.offsetParent!==null),s=r.indexOf(document.activeElement);if(s<0)return;e.preventDefault();let n=e.key==="ArrowDown"?Math.min(s+1,r.length-1):s-1;n<0?M()?.focus():r[n]?.focus();return}let l=i(o.tools)?.dataset.filterKey??"t";if(e.key===l&&!e.defaultPrevented&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!b(e.target)){let r=M();r&&r.offsetParent!==null&&(e.preventDefault(),r.focus(),r.select())}});function q(){h?.disconnect(),h=null;let e=c();e&&(h=new MutationObserver(()=>{!u||T||(T=requestAnimationFrame(()=>{T=0,L()}))}),h.observe(e,{childList:!0,subtree:!0}))}function w(){let e=M();e&&e.value!==u&&(e.value=u),d=null,q(),u&&L()}document.addEventListener("nav",w);document.addEventListener("render",w);w();\n';
var svg = (paths) => /* @__PURE__ */ jsx(
  "svg",
  {
    xmlns: "http://www.w3.org/2000/svg",
    width: "14",
    height: "14",
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
var ICON_FILTER = '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>';
var ICON_EXPAND = '<path d="M12 22v-6"></path><path d="M12 8V2"></path><path d="M4 12H2"></path><path d="M10 12H8"></path><path d="M16 12h-2"></path><path d="M22 12h-2"></path><path d="m15 19-3 3-3-3"></path><path d="m15 5-3-3-3 3"></path>';
var ICON_COLLAPSE = '<path d="M12 22v-6"></path><path d="M12 8V2"></path><path d="M4 12H2"></path><path d="M10 12H8"></path><path d="M16 12h-2"></path><path d="M22 12h-2"></path><path d="m15 19-3-3-3 3"></path><path d="m15 5-3 3-3-3"></path>';
var ICON_LOCATE = '<circle cx="12" cy="12" r="10"></circle><line x1="22" x2="18" y1="12" y2="12"></line><line x1="6" x2="2" y1="12" y2="12"></line><line x1="12" x2="12" y1="6" y2="2"></line><line x1="12" x2="12" y1="22" y2="18"></line>';
var RhinelabSidebarTools_default = ((opts) => {
  const { placeholder = "Filter pages", filterKey = "t" } = opts ?? {};
  const Component = ({ displayClass }) => /* @__PURE__ */ jsxs("div", { class: classNames(displayClass, "mt-tools"), "data-filter-key": filterKey, children: [
    /* @__PURE__ */ jsxs("div", { class: "mt-toolbar", role: "toolbar", "aria-label": "Navigation tools", children: [
      /* @__PURE__ */ jsxs("label", { class: "mt-filter", children: [
        svg(ICON_FILTER),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "search",
            class: "mt-filter-input",
            placeholder,
            "aria-label": "Filter navigation",
            autocomplete: "off",
            spellcheck: false
          }
        ),
        /* @__PURE__ */ jsx("kbd", { children: filterKey })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", class: "mt-btn", "data-mt-act": "expand", title: "Expand all", "aria-label": "Expand all", children: svg(ICON_EXPAND) }),
      /* @__PURE__ */ jsx("button", { type: "button", class: "mt-btn", "data-mt-act": "collapse", title: "Collapse all", "aria-label": "Collapse all", children: svg(ICON_COLLAPSE) }),
      /* @__PURE__ */ jsx("button", { type: "button", class: "mt-btn", "data-mt-act": "locate", title: "Reveal current page", "aria-label": "Reveal current page", children: svg(ICON_LOCATE) })
    ] }),
    /* @__PURE__ */ jsx("div", { class: "mt-empty", hidden: true, children: "no matching pages" })
  ] });
  Component.css = tools_default;
  Component.afterDOMLoaded = tools_inline_default;
  return Component;
});

export { RhinelabSidebarTools_default as RhinelabSidebarTools };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map