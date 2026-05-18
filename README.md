# HailBytes Password Strength Analyzer

> **Zero-dependency web component** — works in Hugo, React, Vue, plain HTML, or any SPA framework. Install via npm or drop in via a `<script type="module">` CDN tag.

[![npm version](https://img.shields.io/npm/v/@hailbytes/password-analyzer.svg)](https://www.npmjs.com/package/@hailbytes/password-analyzer)
[![License: MPL-2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](LICENSE)
[![Zero deps](https://img.shields.io/badge/dependencies-0-brightgreen.svg)](#)

---

## What it is

A single JavaScript file that registers a custom HTML element `<hailbytes-password-strength>`. Drop it anywhere and it works. It uses the **Web Components standard** (Custom Elements + Shadow DOM) so:

- 🔒 Styles are fully encapsulated — no CSS bleed in or out
- 🧩 Framework-agnostic — works in React, Vue, Angular, Svelte, Hugo, Next.js, or plain HTML
- ⚡ No build step — just a `<script type="module">` tag
- 📦 Zero external dependencies

### Features

- Real-time strength meter (5 levels: Very Weak → Very Strong)
- Entropy calculation & estimated crack time
- Keyboard pattern detection (`qwerty`, `asdf`, `1234`, etc.)
- Common password & dictionary word detection
- Character composition breakdown
- Toggle password visibility
- Light/dark theme support
- Fires a `password-score` event on every keystroke for programmatic use
- Static `analyze(password)` method — no DOM element needed

---

## Install

```bash
npm install @hailbytes/password-analyzer
```

Or use it without a bundler via a CDN (see below).

## Quick Start

### 1. npm (bundlers, Next.js, Vite, Webpack, etc.)

```js
// Side-effect import registers the <hailbytes-password-strength> custom element.
import '@hailbytes/password-analyzer';

// Or import the pure DOM-free analyzer:
import { analyze } from '@hailbytes/password-analyzer';
console.log(analyze('Tr0ub4dor&3').score);
```

```html
<hailbytes-password-strength theme="dark"></hailbytes-password-strength>
```

### 2. Plain HTML / Hugo / Static Sites

```html
<!-- Load the component -->
<script type="module" src="hailbytes-password-strength.js"></script>

<!-- Use it anywhere on the page -->
<hailbytes-password-strength></hailbytes-password-strength>

<!-- Dark theme, white-label (no "by HailBytes" footer) -->
<hailbytes-password-strength theme="dark" branding="off"></hailbytes-password-strength>
```

### 3. Via CDN (jsDelivr — no download needed)

```html
<!-- From npm via jsDelivr (recommended — version-pinned) -->
<script type="module"
  src="https://cdn.jsdelivr.net/npm/@hailbytes/password-analyzer/hailbytes-password-strength.js">
</script>

<!-- Or directly from GitHub main (always latest) -->
<script type="module"
  src="https://cdn.jsdelivr.net/gh/HailBytes/hailbytes-password-analyzer@main/hailbytes-password-strength.js">
</script>

<hailbytes-password-strength theme="dark"></hailbytes-password-strength>
```

### 4. React / Vue

```js
// In your entry point or component file:
import 'hailbytes-password-strength.js'; // registers the custom element

// React — tell TypeScript/JSX to treat it as an intrinsic element if needed
// Add to your react-app-env.d.ts or a global.d.ts:
// declare namespace JSX {
//   interface IntrinsicElements {
//     'hailbytes-password-strength': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & { theme?: string };
//   }
// }
```

```jsx
// React component
export function PasswordField() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const handler = (e) => console.log('Score:', e.detail.score);
    el.addEventListener('password-score', handler);
    return () => el.removeEventListener('password-score', handler);
  }, []);

  return <hailbytes-password-strength ref={ref} theme="dark" />;
}
```

```vue
<!-- Vue 3 -->
<template>
  <hailbytes-password-strength
    theme="dark"
    @password-score="onScore"
  />
</template>

<script setup>
import 'hailbytes-password-strength.js';
const onScore = (e) => console.log(e.detail);
</script>
```

---

## API

### Attributes

| Attribute  | Values              | Default   | Description                                          |
|------------|---------------------|-----------|------------------------------------------------------|
| `theme`    | `"light"` / `"dark"` | `"light"` | Color theme for the component                        |
| `branding` | `"off"`             | _(shown)_ | Hide the "by HailBytes" footer for white-label embeds |

### Custom Events

#### `password-score`

Fired on every keystroke. Bubbles up through the DOM.

```js
document.querySelector('hailbytes-password-strength')
  .addEventListener('password-score', (event) => {
    const { score, label, entropy, checks } = event.detail;
    // score: 0–100
    // label: "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong"
    // entropy: number (bits)
    // checks: object with per-rule pass/fail results
    console.log(`${label} (${score}/100) — ${entropy} bits entropy`);
  });
```

### Static Method: `analyze(password)`

Use the scoring engine directly without a DOM element:

```js
import HailbytesPasswordStrength from './hailbytes-password-strength.js';
// or with the named export:
import { analyze } from './hailbytes-password-strength.js';

const result = HailbytesPasswordStrength.analyze('MyP@ssw0rd!');
// result: { score, label, entropy, crackTime, checks, patterns, dictionaryWords, composition }

console.log(result.score);    // e.g. 72
console.log(result.label);    // "Strong"
console.log(result.entropy);  // e.g. 65.4
console.log(result.crackTime); // "Centuries"
```

### Result Object Shape

```ts
{
  score: number;           // 0–100
  label: string;           // "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong"
  color: string;           // hex color matching the strength level
  level: 1 | 2 | 3 | 4 | 5;
  entropy: number;         // bits of entropy
  crackTime: string;       // human-readable crack time
  checks: {
    [key: string]: {
      pass: boolean;
      label: string;
    }
  };
  patterns: string[];      // detected keyboard/sequential patterns
  dictionaryWords: string[]; // detected common/dictionary words
  composition: {
    length: number;
    lowerCount: number;
    upperCount: number;
    numberCount: number;
    symbolCount: number;
    uniqueChars: number;
  };
}
```

---

## Scoring Methodology

| Factor | Max Points |
|--------|-----------|
| Password length (≥16 chars = full) | 30 |
| Character diversity (lower/upper/number/symbol) | 25 |
| Entropy bonus | 20 |
| Unique character ratio | 15 |
| Keyboard pattern penalty | −10 per pattern |
| Dictionary/common word penalty | −15 per match |
| Common password penalty | −30 |

Strength levels: Very Weak (0–19) · Weak (20–39) · Fair (40–59) · Strong (60–79) · Very Strong (80–100)

---

## See also

Part of the HailBytes calculator suite — drop-in web components for security and risk:

- [`@hailbytes/password-analyzer`](https://www.npmjs.com/package/@hailbytes/password-analyzer) — password strength + entropy analyzer _(this package)_
- [`@hailbytes/pentest-calculator`](https://www.npmjs.com/package/@hailbytes/pentest-calculator) — penetration testing scope and cost estimator ([repo](https://github.com/HailBytes/hailbytes-pentest-calculator))
- [`@hailbytes/vulnerability-calculator`](https://www.npmjs.com/package/@hailbytes/vulnerability-calculator) — vulnerability scanner infrastructure sizing ([repo](https://github.com/HailBytes/hailbytes-vulnerability-calculator))
- [`@hailbytes/security-roi-calculator`](https://www.npmjs.com/package/@hailbytes/security-roi-calculator) — security awareness training ROI ([repo](https://github.com/HailBytes/hailbytes-security-roi-calculator))

---

## License

[Mozilla Public License 2.0](LICENSE)

---

## Enterprise Support

[![HailBytes - Managed Security Awareness Training](https://hailbytes.com/images/icons/hb_hb_white_horizontal.png)](https://www.hailbytes.com/sat?utm_source=github&utm_medium=repo_readme&utm_campaign=hailbytes-password-analyzer&utm_content=enterprise_banner)

Running phishing simulations at scale? **HailBytes SAT** delivers managed GoPhish with enterprise support, on AWS and Azure Marketplaces.

[**Get Enterprise Support ->**](https://www.hailbytes.com/sat?utm_source=github&utm_medium=repo_readme&utm_campaign=hailbytes-password-analyzer&utm_content=enterprise_banner)

---

## About HailBytes

[HailBytes](https://hailbytes.com) provides cybersecurity training, phishing simulation, and security awareness tools for organizations.
