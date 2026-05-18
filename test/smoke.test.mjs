// Smoke test for @hailbytes/password-analyzer.
// Uses node:test (built-in, no devDeps) and a minimal DOM shim
// just so the custom-element module can load in Node.

import { test } from 'node:test';
import assert from 'node:assert/strict';

class FakeElement {
  constructor() { this.children = []; this.style = {}; this.classList = { add(){}, remove(){}, toggle(){} }; }
  appendChild(c) { this.children.push(c); return c; }
  setAttribute() {}
  getAttribute() { return null; }
  addEventListener() {}
  removeEventListener() {}
  querySelector() { return new FakeElement(); }
  querySelectorAll() { return []; }
  getElementById() { return new FakeElement(); }
  set innerHTML(_v) {} get innerHTML() { return ''; }
  set textContent(_v) {} get textContent() { return ''; }
  dispatchEvent() { return true; }
  attachShadow() { return new FakeElement(); }
}

globalThis.HTMLElement = class HTMLElement extends FakeElement {};
globalThis.customElements = { define() {}, get() { return undefined; } };
globalThis.document = {
  createElement: () => new FakeElement(),
  createElementNS: () => new FakeElement(),
};
globalThis.CustomEvent = class CustomEvent {
  constructor(type, init = {}) { this.type = type; this.detail = init.detail; this.bubbles = !!init.bubbles; this.composed = !!init.composed; }
};
globalThis.window = globalThis;

const mod = await import('../hailbytes-password-strength.js');

test('module exports a default class', () => {
  assert.equal(typeof mod.default, 'function');
});

test('module exports named analyze()', () => {
  assert.equal(typeof mod.analyze, 'function');
});

test('analyze() returns a structured result for a typical password', () => {
  const r = mod.analyze('Password123!');
  assert.equal(typeof r.score, 'number');
  assert.equal(typeof r.entropy, 'number');
  assert.equal(typeof r.crackTime, 'string');
  assert.equal(typeof r.composition, 'object');
  assert.ok(Array.isArray(r.patterns));
  assert.ok(Array.isArray(r.dictionaryWords));
});

test('analyze("") returns zero-score', () => {
  const r = mod.analyze('');
  assert.equal(r.score, 0);
  assert.equal(r.entropy, 0);
});

test('analyze() flags common passwords', () => {
  const r = mod.analyze('password');
  assert.ok(r.dictionaryWords.length > 0 || r.score <= 1, 'common password should score low or be flagged');
});

test('analyze() rewards a strong, long, mixed password', () => {
  const weak   = mod.analyze('aaaa');
  const strong = mod.analyze('Tr0ub4dor&3-XyZ!Quick-Brown-Fox');
  assert.ok(strong.entropy > weak.entropy);
  assert.ok(strong.score >= weak.score);
});
