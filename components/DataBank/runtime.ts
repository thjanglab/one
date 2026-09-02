// Helpers the generated screens call. They reproduce the three things the
// design prototype's template runtime did at render time, so the converted
// markup behaves exactly as the artboard did.

import React from 'react';

/**
 * Inline `style` strings from the design, turned into React style objects.
 *
 * The design keeps every style inline and rebuilds many of them per render
 * (a colour that depends on the selected axis, an animation delay that
 * depends on a row index), so the same few thousand strings come back on
 * every pass. Caching by string keeps that free and, more importantly,
 * returns a stable object identity so React skips untouched style props.
 */
const styleCache = new Map<string, React.CSSProperties>();

const kebabToCamel = (s: string) => s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

export function S(css: unknown): React.CSSProperties | undefined {
  if (typeof css !== 'string') {
    // A style hole that did not resolve, or an object passed straight through.
    return (css as React.CSSProperties) ?? undefined;
  }
  const hit = styleCache.get(css);
  if (hit) return hit;
  const out: Record<string, string> = {};
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    if (!prop) continue;
    // Custom properties keep their name; everything else is camel-cased.
    out[prop.startsWith('--') ? prop : kebabToCamel(prop)] = decl.slice(i + 1).trim();
  }
  const frozen = out as React.CSSProperties;
  styleCache.set(css, frozen);
  return frozen;
}

/**
 * A `{{ }}` hole in template text.
 *
 * Values that are not renderable text disappear, and plain values are wrapped
 * in the same `sc-interp` span the prototype emitted. The span carries no
 * styling; it is kept so the element tree — and therefore inline layout and
 * text selection — matches the design.
 */
export function I(value: unknown): React.ReactNode {
  if (value === undefined || value === null || typeof value === 'boolean') return null;
  if (React.isValidElement(value) || Array.isArray(value)) return value as React.ReactNode;
  return React.createElement('span', { className: 'sc-interp' }, String(value));
}

/** A `<sc-for>` list. Anything that is not an array renders no rows. */
export function L<T = any>(list: unknown): T[] {
  return Array.isArray(list) ? (list as T[]) : [];
}
