// Converts a Claude Design `.dc.html` artboard into React (TSX) source.
//
// The design bundle ships a prototype written against a small template runtime
// (`support.js`): `<sc-for>` / `<sc-if>` tags, `{{ }}` interpolation, inline
// `style` strings and `style-hover` pseudo-class attributes. That runtime
// compiles the markup to React elements at load time using Babel and a CDN
// copy of React 18.
//
// This script does the same compilation once, ahead of time, and writes plain
// TSX that the app builds with everything else. The output is deliberately a
// faithful transcription: the element tree, the inline style strings and the
// hover rules come across unchanged, so the shipped screens match the design
// pixel for pixel.
//
// Usage: node scripts/dc-to-tsx.mjs <input.dc.html> <outDir>

import { parseFragment } from 'parse5';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

/* ------------------------------------------------------------------ *
 * Source preparation — mirrors support.js `encodeCase`.
 * ------------------------------------------------------------------ */

// The HTML parser lowercases attribute names on HTML elements, which would
// destroy `onClick`, `colSpan` and friends. Stash the casing behind a marker
// prefix and restore it after parsing, exactly as the runtime does.
const CAMEL_ATTR = 'sc-camel-';

// `<table>` and its children impose a content model that would foster-parent
// `<sc-for>` out of the table. Rename them while parsing, then rename back.
const RAW_WRAP = {
  select: 'sc-raw-select', table: 'sc-raw-table', tbody: 'sc-raw-tbody',
  thead: 'sc-raw-thead', tfoot: 'sc-raw-tfoot', tr: 'sc-raw-tr',
  td: 'sc-raw-td', th: 'sc-raw-th', caption: 'sc-raw-caption',
};
const RAW_UNWRAP = Object.fromEntries(Object.entries(RAW_WRAP).map(([k, v]) => [v, k]));

function encodeCase(html) {
  html = html.replace(
    /(\s|^)((?:data-|aria-)?[a-z]+[A-Z][A-Za-z0-9-]*)(=)/g,
    (_, sp, name, eq) => sp + CAMEL_ATTR + name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase()) + eq,
  );
  for (const [real, alias] of Object.entries(RAW_WRAP)) {
    html = html.replace(new RegExp('(</?)' + real + '(?=[\\s>])', 'gi'), '$1' + alias);
  }
  return html;
}

const kebabToCamel = (s) => s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

/* ------------------------------------------------------------------ *
 * Expression compiler — mirrors support.js `resolve` / `resolvePath`.
 *
 * The template language only supports paths, equality comparisons, negation
 * and literals, so each expression maps onto a JavaScript expression of the
 * same shape. Names bound by an enclosing `<sc-for>` stay bare; everything
 * else reads off the render-values object.
 * ------------------------------------------------------------------ */

const IDENT_RE = /^[A-Za-z_$][A-Za-z0-9_$]*/;
const NUMBER_RE = /^-?\d+(\.\d+)?$/;

function parensWrapWhole(expr) {
  let depth = 0;
  for (let i = 0; i < expr.length - 1; i++) {
    if (expr[i] === '(') depth++;
    else if (expr[i] === ')') { depth--; if (depth === 0) return false; }
  }
  return true;
}

function findTopLevelEquality(expr) {
  let depth = 0;
  for (let i = 0; i < expr.length; i++) {
    const c = expr[i];
    if (c === '[' || c === '(') depth++;
    else if (c === ']' || c === ')') depth--;
    else if (depth === 0 && (c === '=' || c === '!') && expr[i + 1] === '=') {
      if (i > 0 && (expr[i - 1] === '=' || expr[i - 1] === '!')) continue;
      if (!expr.slice(0, i).trim()) continue;
      const op = expr[i + 2] === '=' ? c + '==' : c + '=';
      return { index: i, op };
    }
  }
  return null;
}

function compileExpr(src, scope) {
  const expr = String(src).trim();
  if (!expr) return 'undefined';
  if (expr[0] === '(' && expr[expr.length - 1] === ')' && parensWrapWhole(expr)) {
    return '(' + compileExpr(expr.slice(1, -1), scope) + ')';
  }
  const eq = findTopLevelEquality(expr);
  if (eq) {
    const lv = compileExpr(expr.slice(0, eq.index), scope);
    const rv = compileExpr(expr.slice(eq.index + eq.op.length), scope);
    // `==` / `!=` in the template runtime are JS loose comparisons.
    return lv + ' ' + eq.op + ' ' + rv;
  }
  if (expr[0] === '!') return '!(' + compileExpr(expr.slice(1), scope) + ')';
  if (expr === 'true' || expr === 'false' || expr === 'null' || expr === 'undefined') return expr;
  if (NUMBER_RE.test(expr)) return expr;
  if (expr.length >= 2 && (expr[0] === '"' || expr[0] === "'") && expr[expr.length - 1] === expr[0]) {
    return JSON.stringify(expr.slice(1, -1));
  }
  return compilePath(expr, scope);
}

function compilePath(expr, scope) {
  const head = expr.match(IDENT_RE);
  if (!head) return 'undefined';
  const name = head[0];
  // `?.` throughout: the runtime resolves a missing step to `undefined`
  // rather than throwing, and some values are only populated on some screens.
  let out = scope.has(name) ? name : 'v?.' + name;
  let i = name.length;
  while (i < expr.length) {
    if (expr[i] === '.') {
      const rest = expr.slice(i + 1);
      const m = rest.match(IDENT_RE) || rest.match(/^\d+/);
      if (!m) return 'undefined';
      out += /^\d/.test(m[0]) ? '?.[' + m[0] + ']' : '?.' + m[0];
      i += 1 + m[0].length;
    } else if (expr[i] === '[') {
      let depth = 1, j = i + 1;
      while (j < expr.length && depth > 0) {
        if (expr[j] === '[') depth++;
        else if (expr[j] === ']') { depth--; if (depth === 0) break; }
        j++;
      }
      if (depth !== 0) return 'undefined';
      out += '?.[' + compileExpr(expr.slice(i + 1, j), scope) + ']';
      i = j + 1;
    } else return 'undefined';
  }
  return out;
}

/** Compiles an attribute value, which may be a whole expression, a mix of
 *  literal text and holes, or plain text. Returns JS source. */
function compileAttrValue(raw, scope) {
  const whole = raw.match(/^\s*\{\{([\s\S]+?)\}\}\s*$/);
  if (whole) return compileExpr(whole[1], scope);
  if (raw.includes('{{')) {
    const parts = raw.split(/\{\{([\s\S]+?)\}\}/g);
    const pieces = parts.map((s, i) =>
      i & 1 ? '(' + compileExpr(s, scope) + " ?? '')" : JSON.stringify(s));
    return pieces.join(' + ');
  }
  return JSON.stringify(raw);
}

/* ------------------------------------------------------------------ *
 * Attribute mapping
 * ------------------------------------------------------------------ */

const EVENT_MAP = {
  onclick: 'onClick', onchange: 'onChange', oninput: 'onInput',
  onsubmit: 'onSubmit', onfocus: 'onFocus', onblur: 'onBlur',
  onkeydown: 'onKeyDown', onkeyup: 'onKeyUp', onkeypress: 'onKeyPress',
  onmousedown: 'onMouseDown', onmouseup: 'onMouseUp', onmouseenter: 'onMouseEnter',
  onmouseleave: 'onMouseLeave', onmousemove: 'onMouseMove', onmouseover: 'onMouseOver',
  onmouseout: 'onMouseOut', ontouchstart: 'onTouchStart', ontouchend: 'onTouchEnd',
  ontouchmove: 'onTouchMove', onwheel: 'onWheel', onscroll: 'onScroll',
};

// Attributes React expects in a different form from HTML.
const ATTR_RENAME = { class: 'className', for: 'htmlFor' };

// SVG presentation attributes keep their hyphenated form in React, so only
// the ones React insists on camel-casing are listed here.
const SVG_CAMEL = new Set([
  'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray',
  'stroke-dashoffset', 'stroke-opacity', 'stroke-miterlimit', 'fill-opacity',
  'fill-rule', 'clip-path', 'clip-rule', 'vector-effect', 'font-size',
  'font-weight', 'font-family', 'text-anchor', 'dominant-baseline',
  'letter-spacing', 'marker-end', 'marker-start', 'shape-rendering',
  'paint-order', 'stop-color', 'stop-opacity',
]);

function reactAttrName(name) {
  if (name.startsWith(CAMEL_ATTR)) return kebabToCamel(name.slice(CAMEL_ATTR.length));
  if (ATTR_RENAME[name]) return ATTR_RENAME[name];
  if (name.startsWith('on') && EVENT_MAP[name]) return EVENT_MAP[name];
  if (SVG_CAMEL.has(name)) return kebabToCamel(name);
  return name;
}

/* ------------------------------------------------------------------ *
 * Hover sheet — mirrors support.js `createPseudoSheet` + `importantify`.
 * ------------------------------------------------------------------ */

function importantify(css) {
  const decls = [];
  let start = 0, depth = 0, quote = '';
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = ''; }
    else if (c === "'" || c === '"') quote = c;
    else if (c === '(') depth++;
    else if (c === ')') depth = Math.max(0, depth - 1);
    else if (c === ';' && depth === 0) { decls.push(css.slice(start, i)); start = i + 1; }
  }
  decls.push(css.slice(start));
  return decls
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => (/!\s*important\s*$/i.test(d) ? d : d + ' !important'))
    .join(';');
}

/* ------------------------------------------------------------------ *
 * Atomics stylesheet
 * ------------------------------------------------------------------ */

// The class the demo puts on <html> while it is mounted. The artboard styles
// `html`, `body`, `a` and the range inputs directly — fine in a standalone
// prototype, but this build ships them alongside the rest of the app, so the
// element rules are scoped to that class and only bite on the demo route.
// `@keyframes` and `@property` stay global: they are referenced by name from
// the inline styles and the names are unique to this design.
const SCOPE_CLASS = 'dc-databank';

function scopeCss(css) {
  const out = [];
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) { out.push(css.slice(i)); break; }
    const selector = css.slice(i, open).trim();
    let depth = 0, j = open;
    for (; j < css.length; j++) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') { depth--; if (depth === 0) break; }
    }
    const block = css.slice(open, j + 1);
    if (selector.startsWith('@')) {
      out.push(selector + block);
    } else {
      const scoped = selector
        .split(',')
        .map((s) => s.trim())
        .map((s) => (s === 'html' || s.startsWith('html:') || s.startsWith('html.')
          ? s.replace(/^html/, 'html.' + SCOPE_CLASS)
          : 'html.' + SCOPE_CLASS + ' ' + s))
        .join(',');
      out.push(scoped + block);
    }
    i = j + 1;
  }
  return out.join('\n');
}

class HoverSheet {
  constructor() { this.cache = new Map(); this.rules = []; }
  classFor(pseudo, css) {
    const key = pseudo + '|' + css;
    const hit = this.cache.get(key);
    if (hit) return hit;
    const cls = 'scp' + this.cache.size.toString(36);
    const isElement = pseudo === 'before' || pseudo === 'after';
    const sel = isElement ? '.' + cls + '::' + pseudo : '.' + cls + ':' + pseudo;
    this.rules.push(sel + '{' + (isElement ? css : importantify(css)) + '}');
    this.cache.set(key, cls);
    return cls;
  }
  toCss() {
    return [
      '/* Generated by scripts/dc-to-tsx.mjs — do not edit by hand. */',
      '/* `style-hover` attributes from the design prototype, one class each. */',
      ...this.rules,
    ].join('\n') + '\n';
  }
}

/* ------------------------------------------------------------------ *
 * JSX emitter
 * ------------------------------------------------------------------ */

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
  'meta', 'param', 'source', 'track', 'wbr',
]);

// JSX strips whitespace at the start and end of a line and drops
// whitespace-only lines, which HTML does not. Anything whose exact spacing
// could survive to the rendered output — text with newlines or with leading
// or trailing spaces — is emitted as a string expression so it comes through
// byte for byte. That matters for the `white-space: pre` code blocks in the
// grade modal, where a lost newline is a visible break.
function jsxText(text, pre) {
  if (pre) return '{' + JSON.stringify(text) + '}';
  if (/[{}<>]/.test(text)) return '{' + JSON.stringify(text) + '}';
  if (/^\s|\s$|\n/.test(text)) return '{' + JSON.stringify(text) + '}';
  return text;
}

// Whitespace between elements.
//
// A run that spans a newline is the template's own indentation: under
// `white-space: normal` it renders as one space, so one space is what comes
// out and the generated file stays readable. Anything else — a run written on
// one line, or any run inside a `white-space: pre` block, where the gap
// between two highlighted spans is real content — is copied exactly.
// A run with no space in it renders nothing and is dropped, as the runtime
// does.
function jsxGap(text, pre) {
  if (pre || !text.includes('\n')) {
    return text.includes(' ') ? '{' + JSON.stringify(text) + '}' : null;
  }
  return text.includes(' ') ? '{" "}' : null;
}

/** True when the element's literal style keeps whitespace as authored. */
function preservesWhitespace(node) {
  const style = (node.attrs || []).find((a) => a.name === 'style');
  return !!style && /white-space\s*:\s*(pre|pre-wrap|break-spaces)\b/.test(style.value);
}

class Emitter {
  constructor(hover) {
    this.hover = hover;
    this.blocks = new Map();   // extracted component name -> JSX body
    this.extractSet = new Set();
    this.styleCount = 0;
  }

  /** Names of `sc-if` conditions that become their own component file. */
  setExtractions(map) {
    this.extract = map;                       // condition source -> component name
    this.extractSet = new Set(Object.keys(map));
  }

  node(n, scope, indent, pre) {
    if (n.nodeName === '#text') {
      const raw = n.value ?? '';
      if (!raw.includes('{{')) {
        if (!raw.trim()) return jsxGap(raw, pre);
        return jsxText(raw, pre);
      }
      const parts = raw.split(/\{\{([\s\S]+?)\}\}/g);
      return parts
        .map((p, i) => {
          if (i & 1) return '{I(' + compileExpr(p, scope) + ')}';
          if (!p) return '';
          return p.trim() ? jsxText(p, pre) : (jsxGap(p, pre) ?? '');
        })
        .filter(Boolean)
        .join('');
    }
    if (n.nodeName === '#comment') return null;
    if (n.nodeName === '#documentType') return null;

    const tag = n.tagName;
    if (tag === 'sc-for') return this.forNode(n, scope, indent, pre);
    if (tag === 'sc-if') return this.ifNode(n, scope, indent, pre);
    return this.element(n, scope, indent, pre);
  }

  children(n, scope, indent, pre) {
    return (n.childNodes || [])
      .map((c) => this.node(c, scope, indent + '  ', pre))
      .filter((s) => s != null && s !== '');
  }

  forNode(n, scope, indent, pre) {
    const attrs = Object.fromEntries((n.attrs || []).map((a) => [a.name, a.value]));
    const listSrc = compileAttrValue(attrs.list || '', scope);
    const as = attrs.as || 'item';
    const inner = new Set(scope);
    inner.add(as);
    inner.add('$index');
    const kids = this.children(n, inner, indent + '  ', pre);
    const body = kids.length ? kids.join('\n' + indent + '    ') : 'null';
    // `$index` is spelled `$index` in the template; bind it to the map index.
    return (
      '{L(' + listSrc + ').map((' + as + ': any, $index: number) => (\n' +
      indent + '  <React.Fragment key={$index}>\n' +
      indent + '    ' + body + '\n' +
      indent + '  </React.Fragment>\n' +
      indent + '))}'
    );
  }

  ifNode(n, scope, indent, pre) {
    const attrs = Object.fromEntries((n.attrs || []).map((a) => [a.name, a.value]));
    const raw = (attrs.value || '').replace(/^\s*\{\{|\}\}\s*$/g, '').trim();
    const cond = compileAttrValue(attrs.value || '', scope);

    if (this.extractSet.has(raw) && scope.size === 0) {
      const name = this.extract[raw];
      const kids = this.children(n, scope, '  ', pre);
      this.blocks.set(name, kids.join('\n    '));
      return '{(' + cond + ') ? <' + name + ' v={v} /> : null}';
    }

    const kids = this.children(n, scope, indent + '  ', pre);
    const body = kids.length ? kids.join('\n' + indent + '    ') : 'null';
    return (
      '{(' + cond + ') ? (\n' +
      indent + '  <>\n' +
      indent + '    ' + body + '\n' +
      indent + '  </>\n' +
      indent + ') : null}'
    );
  }

  element(n, scope, indent, pre) {
    const tag = RAW_UNWRAP[n.tagName] || n.tagName;
    const props = [];
    let hoverClasses = [];
    let className = null;

    for (const { name, value } of n.attrs || []) {
      if (name === 'data-dc-tpl') continue;
      if (name.startsWith('style-')) {
        // Only literal pseudo-class styles appear in this design; a dynamic
        // one would need a runtime sheet, so fail loudly rather than drop it.
        if (value.includes('{{')) throw new Error('dynamic ' + name + ' is not supported: ' + value);
        hoverClasses.push(this.hover.classFor(name.slice(6), value));
        continue;
      }
      const key = reactAttrName(name);
      if (key === 'className') { className = compileAttrValue(value, scope); continue; }
      if (key === 'style') {
        this.styleCount++;
        props.push('style={S(' + compileAttrValue(value, scope) + ')}');
        continue;
      }
      if (key.startsWith('on') && /^on[A-Z]/.test(key)) {
        props.push(key + '={' + compileAttrValue(value, scope) + '}');
        continue;
      }
      if (key === 'ref') { props.push('ref={' + compileAttrValue(value, scope) + '}'); continue; }
      const compiled = compileAttrValue(value, scope);
      // A plain string literal can be written as a normal JSX attribute.
      props.push(
        /^"(?:[^"\\]|\\.)*"$/.test(compiled) && !compiled.includes('\n')
          ? key + '=' + compiled
          : key + '={' + compiled + '}',
      );
    }

    if (hoverClasses.length || className) {
      const parts = [];
      if (className) parts.push('(' + className + ')');
      for (const c of hoverClasses) parts.push(JSON.stringify(c));
      props.unshift(
        parts.length === 1 && !className
          ? 'className=' + parts[0]
          : 'className={[' + parts.join(', ') + '].filter(Boolean).join(" ")}',
      );
    }

    const attrStr = props.length ? ' ' + props.join(' ') : '';
    // Once inside a `white-space: pre` block every space and newline is
    // content, so children are copied verbatim from here down.
    const kids = this.children(n, scope, indent, pre || preservesWhitespace(n));

    if (!kids.length) {
      if (VOID_TAGS.has(tag)) return '<' + tag + attrStr + ' />';
      return '<' + tag + attrStr + ' />';
    }
    // Keep short text-only elements on one line; the design has thousands of
    // these and one-per-line would make the output unreadable.
    const oneLine = kids.length === 1 && !kids[0].includes('\n') && kids[0].length < 110;
    if (oneLine) return '<' + tag + attrStr + '>' + kids[0] + '</' + tag + '>';
    return (
      '<' + tag + attrStr + '>\n' +
      indent + '  ' + kids.join('\n' + indent + '  ') + '\n' +
      indent + '</' + tag + '>'
    );
  }
}

/* ------------------------------------------------------------------ *
 * Driver
 * ------------------------------------------------------------------ */

// Each of these `sc-if` blocks becomes its own component file. They are the
// six screens plus the modals that sit on top of them.
const EXTRACT = {
  firmsModal: 'ModalFirms',
  setsModal: 'ModalSets',
  gradeModal: 'ModalGrade',
  modal: 'ModalStatement',
  isMap: 'ScreenMap',
  popCh: 'PopClearingHouse',
  popFirms: 'PopFirms',
  popSets: 'PopSets',
  popCap: 'PopCapacity',
  popMoney: 'PopMoney',
  popZone: 'PopZone',
  popAll: 'PopAllRecords',
  isAccount: 'ScreenAccount',
  isDeposit: 'ScreenDeposit',
  isEval: 'ScreenEvaluate',
  isOperate: 'ScreenOperate',
  isPolicy: 'ScreenPolicy',
};

const HEADER = () =>
  `// Generated by scripts/dc-to-tsx.mjs from the Claude Design handoff bundle.\n` +
  `// Do not edit by hand — re-run the converter instead.\n` +
  `/* eslint-disable */\n` +
  `import React from 'react';\n` +
  `import { S, I, L } from '../runtime';\n`;

function main() {
  const [input, outDir] = process.argv.slice(2);
  if (!input || !outDir) {
    console.error('usage: node dc-to-tsx.mjs <input.dc.html> <outDir>');
    process.exit(1);
  }
  const src = readFileSync(input, 'utf8');

  // Split the artboard into its three parts: the atomics stylesheet, the
  // markup, and the logic class.
  const helmet = src.match(/<helmet[^>]*>([\s\S]*?)<\/helmet>/);
  const styleCss = helmet ? (helmet[1].match(/<style>([\s\S]*?)<\/style>/) || [, ''])[1] : '';

  const bodyStart = src.indexOf('</helmet>');
  const scriptStart = src.indexOf('<script type="text/x-dc"');
  const markup = src.slice(bodyStart + '</helmet>'.length, scriptStart)
    .replace(/<\/x-dc>[\s\S]*$/, '')
    .trim();

  const logic = src.slice(src.indexOf('>', scriptStart) + 1, src.lastIndexOf('</script>'));

  mkdirSync(outDir, { recursive: true });

  const hover = new HoverSheet();
  const em = new Emitter(hover);
  em.setExtractions(EXTRACT);

  const frag = parseFragment(encodeCase(markup));
  const rootScope = new Set();
  const rootKids = (frag.childNodes || [])
    .map((c) => em.node(c, rootScope, '    ', false))
    .filter((s) => s != null && s !== '');

  for (const [name, body] of em.blocks) {
    writeFileSync(
      join(outDir, name + '.tsx'),
      HEADER() +
        `\nexport default function ${name}({ v }: { v: any }) {\n  return (\n    <>\n    ${body}\n    </>\n  );\n}\n`,
      'utf8',
    );
  }

  const imports = [...em.blocks.keys()].map((n) => `import ${n} from './${n}';`).join('\n');
  writeFileSync(
    join(outDir, 'Artboard.tsx'),
    HEADER() + imports + '\n' +
      `\nexport default function Artboard({ v }: { v: any }) {\n  return (\n    <>\n    ${rootKids.join('\n    ')}\n    </>\n  );\n}\n`,
    'utf8',
  );

  // The design's logic class is already shaped like a React class component —
  // `state`, `setState`, `componentDidMount` / `DidUpdate` / `WillUnmount` —
  // because the prototype runtime drove it as one. Renaming the base class is
  // the whole port; the body comes across untouched.
  writeFileSync(
    join(outDir, 'logic.ts'),
    '// Generated by scripts/dc-to-tsx.mjs from the Claude Design handoff bundle.\n' +
      '// Do not edit by hand — re-run the converter instead.\n' +
      // The body below is the design's own JavaScript, transcribed rather
      // than rewritten: `this` carries element refs and timer handles that
      // were never declared, and `setState` is called with partials that
      // TypeScript narrows further than the code expects. Typing it would
      // mean editing generated output on every regeneration; the screens it
      // renders are checked instead, by scripts/compare-to-design.mjs.
      '// @ts-nocheck\n' +
      '/* eslint-disable */\n' +
      "import React from 'react';\n\n" +
      logic
        .trim()
        .replace(
          /class Component extends DCLogic \{/,
          'export class DataBankLogic extends React.Component<any, any> {\n' +
            '  // The design keeps element refs, timer handles and animation\n' +
            '  // bookkeeping on the instance; this lets it carry on doing that.\n' +
            '  [key: string]: any;\n',
        ) +
      '\n',
    'utf8',
  );

  writeFileSync(join(outDir, 'hover.css'), hover.toCss(), 'utf8');
  writeFileSync(
    join(outDir, 'atomics.css'),
    "/* Generated by scripts/dc-to-tsx.mjs — the design prototype's stylesheet.\n" +
      `   Element rules are scoped to html.${SCOPE_CLASS}, which the demo adds\n` +
      '   while it is mounted; keyframes stay global and are referenced by name\n' +
      '   from the inline styles. */\n' +
      scopeCss(styleCss.trim()) + '\n',
    'utf8',
  );
  

  console.log(
    `${basename(input)} -> ${outDir}\n` +
      `  components   ${em.blocks.size + 1}\n` +
      `  style attrs  ${em.styleCount}\n` +
      `  hover rules  ${hover.rules.length}\n` +
      `  logic lines  ${logic.trim().split('\n').length}`,
  );
}

main();
