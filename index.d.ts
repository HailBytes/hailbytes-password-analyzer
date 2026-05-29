/**
 * Type declarations for @hailbytes/password-analyzer.
 */

export interface PasswordComposition {
  length: number;
  lowerCount: number;
  upperCount: number;
  numberCount: number;
  symbolCount: number;
  uniqueChars: number;
}

export interface PasswordCheck {
  label: string;
  pass: boolean;
}

export interface PasswordAnalysis {
  score: number;
  level?: string;
  label: string;
  color?: string;
  entropy: number;
  crackTime: string;
  composition: PasswordComposition;
  checks: Record<string, PasswordCheck>;
  patterns: string[];
  dictionaryWords: string[];
}

/**
 * Analyze a password without needing a DOM element.
 * Pure function — safe to call from Node, workers, or any JS environment.
 */
export function analyze(password: string): PasswordAnalysis;

/**
 * The custom-element class. Importing this module also registers
 * the `<hailbytes-password-strength>` tag via `customElements.define`.
 *
 * Supported attributes:
 *   - `theme="dark"|"light"`  (default: `"light"`)
 *   - `branding="off"`        hides the "by HailBytes" footer
 */
export default class HailbytesPasswordStrength extends HTMLElement {
  static readonly observedAttributes: readonly string[];
}

declare global {
  interface HTMLElementTagNameMap {
    'hailbytes-password-strength': HailbytesPasswordStrength;
  }
  interface HTMLElementEventMap {
    'password-score': CustomEvent<PasswordAnalysis>;
  }
}
