/// <reference no-default-lib="true"/>
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

export interface VNode {
  tag: string;
  attrs: Record<string, unknown>;
  children: VNode[];
}

export function h(
  tag: string,
  attrs: Record<string, unknown>,
  ...children: VNode[]
): VNode {
  return { tag, attrs, children };
}

export function renderToString(vdom: VNode | string | number): string {
  if (typeof vdom === "string" || typeof vdom === "number") {
    return String(vdom);
  }

  const attrs = vdom.attrs
    ? Object.keys(vdom.attrs)
      .map((key) => ` ${key}="${vdom.attrs[key]}"`)
      .join("")
    : "";
  const children = vdom.children.map((child) => renderToString(child)).join("");

  return `<${vdom.tag}${attrs}>${children}</${vdom.tag}>`;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: unknown;
    }
  }
}
