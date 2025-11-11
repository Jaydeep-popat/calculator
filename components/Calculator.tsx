'use client';

import { useState, useEffect } from 'react';
import styles from './Calculator.module.css';
import BasicPanel from './BasicPanel';
import ScientificPanel from './ScientificPanel';
import CurrencyPanel from './CurrencyPanel';
import { CalculatorState } from '@/types';

type Mode = 'basic' | 'sci' | 'fx';

export default function Calculator() {
  const [mode, setMode] = useState<Mode>('basic');
  const [state, setState] = useState<CalculatorState>({
    result: '0',
    history: '',
    degMode: true,
    memory: 0,
    lastAnswer: 0,
  });

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when in text inputs
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName)) return;

      const k = e.key;
      if (/^[0-9]$/.test(k)) return append(k);
      if (k === '.') return append('.');
      if (['+', '-', '*', '/', '^', '(', ')'].includes(k)) return append(k);
      if (k === '%') return toPercent();
      if (k.toLowerCase() === 'p' && e.altKey) return insertConst('π');
      if (k === 'Enter' || k === '=') {
        e.preventDefault();
        return equals();
      }
      if (k === 'Backspace') return backspace();
      if (k === 'Escape') return clearAll();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.result, state.degMode]);

  const setResult = (text: string) => {
    setState((prev) => ({ ...prev, result: text }));
  };

  const ops = new Set(['+', '-', '*', '/', '^']);

  const append = (char: string) => {
    const cur = state.result === '0' ? '' : state.result;
    const last = cur.slice(-1);

    // Prevent two operators in a row (replace instead)
    if (ops.has(char)) {
      if (cur === '' && char !== '-') return;
      if (ops.has(last)) {
        setResult(cur.slice(0, -1) + char);
        return;
      }
    }

    // Single dot per number chunk
    if (char === '.') {
      const chunk = cur.split(/[-+*/^]/).pop() || '';
      if (chunk.includes('.')) return;
    }

    setResult((cur + char) || '0');
  };

  const toPercent = () => {
    let cur = state.result;
    if (!cur || cur === '0') return;
    cur = cur.replace(/(\d+\.?\d*)$/, (m) => String(parseFloat(m) / 100));
    setResult(cur);
  };

  const clearAll = () => {
    setState((prev) => ({ ...prev, result: '0', history: '' }));
  };

  const backspace = () => {
    const cur = state.result;
    if (cur.length <= 1) return setResult('0');
    setResult(cur.slice(0, -1));
  };

  const insertFn = (name: string) => {
    const cur = state.result === '0' ? '' : state.result;
    const needsMul = /[\d)πℯ]$/.test(cur);
    setResult(cur + (needsMul ? '*' : '') + name + '(');
  };

  const insertConst = (sym: string) => {
    const cur = state.result === '0' ? '' : state.result;
    const needsMul = /[\d)πℯ]$/.test(cur);
    setResult((needsMul ? cur + '*' : cur) + sym);
  };

  const negate = () => {
    let cur = state.result;
    if (cur === '0') {
      setResult('-');
      return;
    }
    const m = cur.match(/(\([^()]*\)|\d+\.?\d*|π|ℯ)$/);
    if (m) {
      const start = cur.slice(0, -m[0].length);
      setResult(start + '(-' + m[0] + ')');
    } else {
      setResult('-(' + cur + ')');
    }
  };

  const square = () => {
    const cur = state.result;
    const m = cur.match(/(\([^()]*\)|\d+\.?\d*|π|ℯ)$/);
    if (!m) return;
    setResult(cur.replace(/(\([^()]*\)|\d+\.?\d*|π|ℯ)$/, '($1)^2'));
  };

  const sqrt = () => {
    const cur = state.result;
    const m = cur.match(/(\([^()]*\)|\d+\.?\d*|π|ℯ)$/);
    if (!m) {
      insertFn('sqrt');
      return;
    }
    setResult(cur.replace(/(\([^()]*\)|\d+\.?\d*|π|ℯ)$/, 'sqrt($1)'));
  };

  const factorial = () => {
    const cur = state.result;
    const m = cur.match(/(\([^()]*\)|\d+\.?\d*|π|ℯ)$/);
    if (!m) return;
    setResult(cur + '!');
  };

  const preprocess = (expr: string): string => {
    if (!/^[-+*/^().,%\d\sπℯa-zA-Z]+$/.test(expr))
      throw new Error('Invalid expression');

    expr = expr.replace(/%/g, '/100');
    expr = expr.replace(/π/g, 'Math.PI');
    expr = expr.replace(/ℯ/g, 'Math.E');
    expr = expr.replace(/\^/g, '**');

    while (/(\([^()]*\)|\d+\.?\d*|Math\.PI|Math\.E)!/.test(expr)) {
      expr = expr.replace(
        /(\([^()]*\)|\d+\.?\d*|Math\.PI|Math\.E)!/g,
        'FACT($1)'
      );
    }

    expr = expr
      .replace(/\bsin\(/g, 'SIN(')
      .replace(/\bcos\(/g, 'COS(')
      .replace(/\btan\(/g, 'TAN(')
      .replace(/\bln\(/g, 'LN(')
      .replace(/\blog\(/g, 'LOG(')
      .replace(/\bsqrt\(/g, 'Math.sqrt(');

    return expr;
  };

  const safeEval = (expr: string): number => {
    const RAD = !state.degMode;
    const toRad = (x: number) => (x * Math.PI) / 180;
    const SIN = (x: number) => Math.sin(RAD ? x : toRad(x));
    const COS = (x: number) => Math.cos(RAD ? x : toRad(x));
    const TAN = (x: number) => Math.tan(RAD ? x : toRad(x));
    const LN = (x: number) => Math.log(x);
    const LOG = (x: number) => Math.log10(x);
    const FACT = (n: number) => {
      if (!Number.isFinite(n) || n < 0 || Math.floor(n) !== n)
        throw new Error('Invalid factorial');
      let r = 1;
      for (let i = 2; i <= n; i++) r *= i;
      return r;
    };

    // eslint-disable-next-line no-new-func
    return Function('"use strict"; return (' + expr + ')')();
  };

  const equals = () => {
    const exprRaw = state.result;
    if (!exprRaw) return;

    try {
      const expr = preprocess(exprRaw);
      const val = safeEval(expr);
      const out = Number.isFinite(val) ? +parseFloat(val.toFixed(12)) : NaN;

      setState((prev) => ({
        ...prev,
        history: exprRaw + ' =',
        result: isNaN(out) ? 'Error' : String(out),
        lastAnswer: isNaN(out) ? prev.lastAnswer : out,
      }));

      if (isNaN(out)) {
        setTimeout(() => setResult('0'), 900);
      }
    } catch (e) {
      setState((prev) => ({ ...prev, history: '', result: 'Error' }));
      setTimeout(() => setResult('0'), 900);
    }
  };

  const handleMemoryClear = () => {
    setState((prev) => ({ ...prev, memory: 0 }));
  };

  const handleMemoryRecall = () => {
    const cur = state.result === '0' ? '' : state.result;
    const needsMul = /[\d)πℯ]$/.test(cur);
    setResult((needsMul ? cur + '*' : cur) + String(state.memory));
  };

  const handleAns = () => {
    const cur = state.result === '0' ? '' : state.result;
    const needsMul = /[\d)πℯ]$/.test(cur);
    setResult((needsMul ? cur + '*' : cur) + String(state.lastAnswer));
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.calculator} role="application" aria-label="Calculator">
        <div className={styles.toolbar}>
          <div className={styles.seg} role="tablist" aria-label="Mode">
            <button
              role="tab"
              aria-selected={mode === 'basic'}
              className={mode === 'basic' ? styles.active : ''}
              onClick={() => setMode('basic')}
            >
              Basic
            </button>
            <button
              role="tab"
              aria-selected={mode === 'sci'}
              className={mode === 'sci' ? styles.active : ''}
              onClick={() => setMode('sci')}
            >
              Scientific
            </button>
            <button
              role="tab"
              aria-selected={mode === 'fx'}
              className={mode === 'fx' ? styles.active : ''}
              onClick={() => setMode('fx')}
            >
              Currency
            </button>
          </div>
          <div
            className={styles.degToggle}
            style={{ visibility: mode === 'sci' ? 'visible' : 'hidden' }}
          >
            <label>
              <input
                type="checkbox"
                checked={state.degMode}
                onChange={(e) =>
                  setState((prev) => ({ ...prev, degMode: e.target.checked }))
                }
              />{' '}
              Deg
            </label>
            <span className={styles.subtle}>
              · M: <span>{state.memory}</span>
            </span>
          </div>
        </div>

        <div className={styles.display} aria-live="polite">
          <div className={styles.history}>{state.history}</div>
          <div className={styles.result}>{state.result}</div>
        </div>

        {mode === 'basic' && (
          <BasicPanel
            onAppend={append}
            onClear={clearAll}
            onBackspace={backspace}
            onPercent={toPercent}
            onEquals={equals}
          />
        )}

        {mode === 'sci' && (
          <ScientificPanel
            onAppend={append}
            onClear={clearAll}
            onBackspace={backspace}
            onEquals={equals}
            onSquare={square}
            onSqrt={sqrt}
            onFactorial={factorial}
            onNegate={negate}
            onInsertFn={insertFn}
            onInsertConst={insertConst}
            onMemoryClear={handleMemoryClear}
            onMemoryRecall={handleMemoryRecall}
            onAns={handleAns}
          />
        )}

        {mode === 'fx' && (
          <CurrencyPanel
            onSendToCalc={(value: number) => {
              setMode('basic');
              setResult(String(value));
            }}
            onUpdateHistory={(text: string) => {
              setState((prev) => ({ ...prev, history: text }));
            }}
          />
        )}

        <div className={styles.brand}>
          <span>Glass Calc</span>
          <span>
            <span className={styles.kbd}>Enter</span> = equals ·{' '}
            <span className={styles.kbd}>Esc</span> = clear ·{' '}
            <span className={styles.kbd}>⌫</span> = delete
          </span>
        </div>
      </div>
    </div>
  );
}
