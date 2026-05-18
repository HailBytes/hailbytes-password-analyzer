/**
 * HailBytes Password Strength Analyzer
 * Zero-dependency Web Component — no build step required.
 * Usage: <hailbytes-password-strength></hailbytes-password-strength>
 *
 * @license MPL-2.0
 * @see https://hailbytes.com
 */

// ─── Core analysis engine (no DOM required) ───────────────────────────────────

const COMMON_PASSWORDS = new Set([
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'iloveyou',
  'princess', 'rockyou', '12345678', 'sunshine', 'football', 'shadow',
  'master', 'superman', 'michael', 'jessica', 'dragon', 'baseball',
  'pass', 'trustno1', 'login', 'hello', 'mustang', 'access',
  'passw0rd', 'p@ssword', 'p@ss', '000000', '111111', '123123',
  'qwerty123', 'test', 'test123', 'welcome1', 'changeme',
]);

const KEYBOARD_PATTERNS = [
  'qwerty', 'qwertyuiop', 'asdfghjkl', 'asdf', 'zxcvbnm', 'zxcv',
  '1234567890', '1234', '4321', '0987', 'abcd', 'dcba',
  'qazwsx', 'wsxedc', 'edcrfv',
];

const DICTIONARY_WORDS = new Set([
  'password', 'admin', 'user', 'login', 'welcome', 'home', 'test',
  'guest', 'info', 'master', 'root', 'system', 'manager', 'service',
  'pass', 'secure', 'security', 'access', 'network', 'server',
  'internet', 'email', 'office', 'work', 'house', 'name', 'love',
  'baby', 'angel', 'sun', 'moon', 'star', 'dragon', 'super',
]);

const LEET_MAP = { '@': 'a', '3': 'e', '1': 'i', '0': 'o', '5': 's', '7': 't', '$': 's', '4': 'a' };

function calcEntropy(password) {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
  let charSpace = 0;
  if (hasLower) charSpace += 26;
  if (hasUpper) charSpace += 26;
  if (hasNumber) charSpace += 10;
  if (hasSymbol) charSpace += 32;
  return password.length > 0 && charSpace > 0
    ? Math.log2(Math.pow(charSpace, password.length))
    : 0;
}

function isSequential(numStr) {
  for (let i = 0; i < numStr.length - 1; i++) {
    if (parseInt(numStr[i + 1]) !== parseInt(numStr[i]) + 1) return false;
  }
  return true;
}

function detectPatterns(password) {
  const found = [];
  const lower = password.toLowerCase();

  KEYBOARD_PATTERNS.forEach(p => {
    if (lower.includes(p)) found.push(`Keyboard pattern: ${p}`);
  });

  const nums = password.match(/\d{3,}/g);
  if (nums) {
    nums.forEach(n => { if (isSequential(n)) found.push(`Sequential numbers: ${n}`); });
  }

  const repeated = password.match(/(.)\1{2,}/g);
  if (repeated) repeated.forEach(r => found.push(`Repeated chars: ${r}`));

  // Leet-speak common password
  let deLeeted = lower;
  Object.entries(LEET_MAP).forEach(([k, v]) => {
    deLeeted = deLeeted.replace(new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), v);
  });
  if (COMMON_PASSWORDS.has(deLeeted) && !COMMON_PASSWORDS.has(lower)) {
    found.push('Common password with character substitutions');
  }

  return found;
}

function detectDictionary(password) {
  const found = [];
  const lower = password.toLowerCase();
  if (COMMON_PASSWORDS.has(lower)) found.push('Common password');
  DICTIONARY_WORDS.forEach(w => { if (lower.includes(w) && !found.includes(w)) found.push(w); });
  return found;
}

function estimateCrackTime(entropy) {
  if (entropy <= 0) return 'Instant';
  const guessesPerSec = 1e9;
  const secs = Math.pow(2, entropy) / 2 / guessesPerSec;
  if (secs < 1) return 'Instant';
  if (secs < 60) return `${Math.ceil(secs)} seconds`;
  if (secs < 3600) return `${Math.ceil(secs / 60)} minutes`;
  if (secs < 86400) return `${Math.ceil(secs / 3600)} hours`;
  if (secs < 2592000) return `${Math.ceil(secs / 86400)} days`;
  if (secs < 31536000) return `${Math.ceil(secs / 2592000)} months`;
  if (secs < 31536000000) return `${Math.ceil(secs / 31536000)} years`;
  return 'Centuries';
}

function strengthLabel(score) {
  if (score >= 80) return { level: 5, text: 'Very Strong', color: '#1e90ff' };
  if (score >= 60) return { level: 4, text: 'Strong',     color: '#2ed573' };
  if (score >= 40) return { level: 3, text: 'Fair',       color: '#ffa502' };
  if (score >= 20) return { level: 2, text: 'Weak',       color: '#ff6b35' };
  return                    { level: 1, text: 'Very Weak', color: '#ff4757' };
}

/**
 * Core analysis — pure function, no DOM.
 * @param {string} password
 * @returns {{ score, label, entropy, crackTime, checks, patterns, dictionaryWords, composition }}
 */
function analyzePassword(password) {
  if (!password) {
    return { score: 0, label: 'Very Weak', entropy: 0, crackTime: 'Instant',
             checks: {}, patterns: [], dictionaryWords: [], composition: {} };
  }

  const len = password.length;
  const hasLower  = /[a-z]/.test(password);
  const hasUpper  = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);

  const lowerCount  = (password.match(/[a-z]/g)    || []).length;
  const upperCount  = (password.match(/[A-Z]/g)    || []).length;
  const numberCount = (password.match(/\d/g)        || []).length;
  const symbolCount = (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/g) || []).length;
  const uniqueChars = new Set(password.toLowerCase()).size;

  const entropy = calcEntropy(password);
  const patterns = detectPatterns(password);
  const dictionaryWords = detectDictionary(password);

  // ── Scoring ──────────────────────────────────────────────────────────────
  let score = 0;

  // Length (0–30)
  if (len >= 16) score += 30;
  else if (len >= 12) score += 25;
  else if (len >= 8)  score += 15;
  else if (len >= 6)  score += 8;
  else                score += len * 2;

  // Diversity (0–25)
  if (hasLower)  score += 5;
  if (hasUpper)  score += 5;
  if (hasNumber) score += 5;
  if (hasSymbol) score += 10;

  // Entropy bonus (0–20)
  if (entropy > 60)      score += 20;
  else if (entropy > 40) score += 15;
  else if (entropy > 25) score += 10;
  else                   score += Math.floor(entropy / 5);

  // Unique char bonus (0–15)
  if (len > 0) score += Math.floor((uniqueChars / len) * 15);

  // Penalties
  score -= patterns.length * 10;
  score -= dictionaryWords.length * 15;
  if (COMMON_PASSWORDS.has(password.toLowerCase())) score -= 30;

  score = Math.max(0, Math.min(100, score));

  const strengthInfo = strengthLabel(score);

  const checks = {
    length:         { pass: len >= 8,      label: `Length ≥ 8 (${len})` },
    longLength:     { pass: len >= 12,     label: `Length ≥ 12 (${len})` },
    lowercase:      { pass: hasLower,      label: 'Lowercase letters' },
    uppercase:      { pass: hasUpper,      label: 'Uppercase letters' },
    numbers:        { pass: hasNumber,     label: 'Numbers' },
    symbols:        { pass: hasSymbol,     label: 'Special characters' },
    noCommon:       { pass: !COMMON_PASSWORDS.has(password.toLowerCase()), label: 'Not a common password' },
    noPatterns:     { pass: patterns.length === 0,       label: 'No keyboard patterns' },
    noDictionary:   { pass: dictionaryWords.length === 0, label: 'No common words' },
    highEntropy:    { pass: entropy >= 50, label: `High entropy (${entropy.toFixed(1)} bits)` },
  };

  return {
    score,
    label: strengthInfo.text,
    color: strengthInfo.color,
    level: strengthInfo.level,
    entropy: parseFloat(entropy.toFixed(1)),
    crackTime: estimateCrackTime(entropy),
    checks,
    patterns,
    dictionaryWords,
    composition: { length: len, lowerCount, upperCount, numberCount, symbolCount, uniqueChars },
  };
}

// ─── Web Component ────────────────────────────────────────────────────────────

const COMPONENT_CSS = `
  :host {
    display: block;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.5;
    box-sizing: border-box;
  }
  *, *::before, *::after { box-sizing: inherit; }

  :host([branding="off"]) .hb-branding { display: none; }

  /* ── Theme variables ── */
  :host([theme="dark"]), :host(.dark) {
    --bg:          #1a1a2e;
    --bg-card:     #16213e;
    --bg-input:    #0f3460;
    --border:      #2d4a7a;
    --text:        #e0e0e0;
    --text-muted:  #8892a4;
    --accent:      #ff6b35;
    --pass-color:  #2ed573;
    --fail-color:  #ff4757;
    --shadow:      0 4px 24px rgba(0,0,0,.45);
  }
  :host, :host([theme="light"]) {
    --bg:          #f5f7fa;
    --bg-card:     #ffffff;
    --bg-input:    #ffffff;
    --border:      #dde2ec;
    --text:        #1a1a2e;
    --text-muted:  #6b7280;
    --accent:      #ff6b35;
    --pass-color:  #16a34a;
    --fail-color:  #dc2626;
    --shadow:      0 4px 24px rgba(0,0,0,.08);
  }

  .wrapper {
    background: var(--bg);
    color: var(--text);
    border-radius: 14px;
    padding: 1.5rem;
    box-shadow: var(--shadow);
    max-width: 600px;
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    gap: .75rem;
    margin-bottom: 1.25rem;
  }
  .logo-mark {
    width: 36px; height: 36px;
    background: var(--accent);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.1rem; font-weight: 700; color: #fff;
    flex-shrink: 0;
  }
  .header h2 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text);
  }
  .header p {
    margin: 0;
    font-size: .8rem;
    color: var(--text-muted);
  }

  /* ── Input row ── */
  .input-row {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: .75rem;
  }
  .pw-input {
    width: 100%;
    padding: .75rem 3rem .75rem .9rem;
    font-size: 1rem;
    font-family: 'Courier New', monospace;
    background: var(--bg-input);
    border: 2px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    outline: none;
    transition: border-color .2s;
  }
  .pw-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(255,107,53,.15);
  }
  .toggle-btn {
    position: absolute;
    right: .6rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.15rem;
    padding: .3rem .45rem;
    border-radius: 5px;
    color: var(--text-muted);
    transition: background .15s;
    line-height: 1;
  }
  .toggle-btn:hover { background: rgba(128,128,128,.12); }

  /* ── Strength meter ── */
  .meter-row {
    display: flex;
    align-items: center;
    gap: .75rem;
    margin-bottom: 1rem;
  }
  .meter-track {
    flex: 1;
    height: 10px;
    background: var(--border);
    border-radius: 5px;
    overflow: hidden;
  }
  .meter-fill {
    height: 100%;
    width: 0%;
    border-radius: 5px;
    transition: width .45s ease, background-color .3s ease;
    background: #ccc;
  }
  .meter-fill[data-level="1"] { background: #ff4757; }
  .meter-fill[data-level="2"] { background: #ff6b35; }
  .meter-fill[data-level="3"] { background: #ffa502; }
  .meter-fill[data-level="4"] { background: #2ed573; }
  .meter-fill[data-level="5"] { background: #1e90ff; }

  .strength-label {
    min-width: 80px;
    font-size: .85rem;
    font-weight: 600;
    text-align: right;
    color: var(--text-muted);
  }

  /* ── Score pill ── */
  .score-pill {
    display: inline-block;
    font-size: .75rem;
    font-weight: 700;
    color: #fff;
    background: var(--accent);
    border-radius: 20px;
    padding: .15rem .6rem;
    margin-left: .4rem;
    vertical-align: middle;
  }

  /* ── Stats row ── */
  .stats-row {
    display: flex;
    gap: .5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .stat-chip {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: .35rem .75rem;
    font-size: .8rem;
    color: var(--text-muted);
  }
  .stat-chip strong { color: var(--text); }

  /* ── Breakdown panel ── */
  .breakdown {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }
  .breakdown-header {
    padding: .6rem 1rem;
    font-size: .8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .05em;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
  }
  .checks-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }
  @media (max-width: 380px) { .checks-grid { grid-template-columns: 1fr; } }
  .check-item {
    display: flex;
    align-items: center;
    gap: .5rem;
    padding: .45rem 1rem;
    font-size: .82rem;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
  }
  .check-item:nth-last-child(-n+2) { border-bottom: none; }
  .check-icon { font-size: .9rem; flex-shrink: 0; }
  .check-icon.pass { color: var(--pass-color); }
  .check-icon.fail { color: var(--fail-color); }

  /* ── Pattern / dictionary warnings ── */
  .warnings {
    margin-top: .75rem;
    display: flex;
    flex-direction: column;
    gap: .4rem;
  }
  .warning-chip {
    display: flex;
    align-items: center;
    gap: .4rem;
    background: rgba(255,107,53,.08);
    border: 1px solid rgba(255,107,53,.25);
    border-radius: 7px;
    padding: .35rem .7rem;
    font-size: .8rem;
    color: var(--accent);
  }

  /* ── Crack time footer ── */
  .crack-footer {
    margin-top: .75rem;
    font-size: .78rem;
    color: var(--text-muted);
    text-align: right;
  }

  /* ── Placeholder state ── */
  .placeholder {
    padding: 1rem 0 .5rem;
    text-align: center;
    color: var(--text-muted);
    font-size: .9rem;
  }
`;

class HailbytesPasswordStrength extends HTMLElement {
  static get observedAttributes() { return ['theme', 'branding']; }

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._visible = false;
    this._lastResult = null;
  }

  connectedCallback() {
    this._render();
    this._bindEvents();
  }

  attributeChangedCallback() {
    if (this._shadow.innerHTML) this._render();
  }

  // ── Public static API ────────────────────────────────────────────────────
  static analyze(password) {
    return analyzePassword(password);
  }

  // ── Render ───────────────────────────────────────────────────────────────
  _render() {
    const theme = this.getAttribute('theme') || 'light';
    this._shadow.innerHTML = `
      <style>${COMPONENT_CSS}</style>
      <div class="wrapper" part="wrapper">
        <div class="header">
          <div class="logo-mark">🔐</div>
          <div>
            <h2>Password Strength Analyzer</h2>
            <p class="hb-branding">by <a href="https://hailbytes.com/sat" target="_blank" rel="noopener" style="color:var(--accent);text-decoration:none">HailBytes</a></p>
          </div>
        </div>

        <div class="input-row">
          <input class="pw-input" id="pw" type="password" placeholder="Enter a password to analyze…" autocomplete="new-password" spellcheck="false" />
          <button class="toggle-btn" id="toggle" title="Toggle visibility" aria-label="Toggle password visibility">👁️</button>
        </div>

        <div class="meter-row">
          <div class="meter-track"><div class="meter-fill" id="fill"></div></div>
          <span class="strength-label" id="slabel">—</span>
        </div>

        <div id="details">
          <div class="placeholder">Type a password above to see a full strength breakdown.</div>
        </div>
      </div>
    `;

    // Re-bind after re-render
    this._bindEvents();
  }

  _bindEvents() {
    const root = this._shadow;
    const pwInput = root.getElementById('pw');
    const toggleBtn = root.getElementById('toggle');
    if (!pwInput) return;

    pwInput.addEventListener('input', () => this._onInput(pwInput.value));
    pwInput.addEventListener('paste', () => setTimeout(() => this._onInput(pwInput.value), 10));

    toggleBtn.addEventListener('click', () => {
      this._visible = !this._visible;
      pwInput.type = this._visible ? 'text' : 'password';
      toggleBtn.textContent = this._visible ? '🙈' : '👁️';
    });
  }

  _onInput(value) {
    const result = analyzePassword(value);
    this._lastResult = result;
    this._updateUI(value, result);

    this.dispatchEvent(new CustomEvent('password-score', {
      bubbles: true, composed: true,
      detail: {
        score:   result.score,
        label:   result.label,
        entropy: result.entropy,
        checks:  result.checks,
      },
    }));
  }

  _updateUI(value, r) {
    const root = this._shadow;
    const fill   = root.getElementById('fill');
    const slabel = root.getElementById('slabel');
    const details = root.getElementById('details');

    if (!value) {
      fill.style.width = '0%';
      fill.removeAttribute('data-level');
      slabel.textContent = '—';
      slabel.style.color = '';
      details.innerHTML = '<div class="placeholder">Type a password above to see a full strength breakdown.</div>';
      return;
    }

    // Meter
    fill.style.width = `${r.score}%`;
    fill.setAttribute('data-level', r.level);

    // Label
    slabel.textContent = r.label;
    slabel.style.color = r.color;
    slabel.innerHTML = `${r.label} <span class="score-pill">${r.score}</span>`;

    // Stats
    const statsHTML = `
      <div class="stats-row">
        <div class="stat-chip">Length: <strong>${r.composition.length}</strong></div>
        <div class="stat-chip">Entropy: <strong>${r.entropy} bits</strong></div>
        <div class="stat-chip">Crack time: <strong>${r.crackTime}</strong></div>
      </div>
    `;

    // Checks grid
    const checksHTML = Object.values(r.checks).map(c => `
      <div class="check-item">
        <span class="check-icon ${c.pass ? 'pass' : 'fail'}">${c.pass ? '✓' : '✗'}</span>
        <span>${c.label}</span>
      </div>
    `).join('');

    // Warnings (patterns + dictionary)
    const allWarnings = [...r.patterns, ...r.dictionaryWords.filter(w => w !== 'Common password')];
    const warningsHTML = (r.dictionaryWords.includes('Common password') || allWarnings.length > 0)
      ? `<div class="warnings">
          ${r.dictionaryWords.includes('Common password')
            ? '<div class="warning-chip">⚠️ This is a known common password — do not use it!</div>'
            : ''}
          ${allWarnings.map(w => `<div class="warning-chip">⚠️ ${w}</div>`).join('')}
        </div>`
      : '';

    details.innerHTML = `
      ${statsHTML}
      <div class="breakdown">
        <div class="breakdown-header">Security Checks</div>
        <div class="checks-grid">${checksHTML}</div>
      </div>
      ${warningsHTML}
      <div class="crack-footer">⏱ Estimated offline crack time at 1B guesses/sec</div>
    `;
  }
}

customElements.define('hailbytes-password-strength', HailbytesPasswordStrength);

export default HailbytesPasswordStrength;
export { analyzePassword as analyze };
