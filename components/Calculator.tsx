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
  const [isSuccess, setIsSuccess] = useState(false);

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
    const lastTwo = cur.slice(-2);

    // Prevent expressions that are too long
    if (cur.length > 200) return;

    // Prevent two operators in a row (replace instead)
    if (ops.has(char)) {
      if (cur === '' && char !== '-') return;
      if (ops.has(last)) {
        setResult(cur.slice(0, -1) + char);
        return;
      }
      // Prevent operator after opening parenthesis (except minus for negative numbers)
      if (last === '(' && char !== '-') return;
    }

    // Single dot per number chunk
    if (char === '.') {
      // Don't allow dot after operators
      if (ops.has(last) || last === '(') return;
      
      // Find the last complete number to check for existing decimal
      const match = cur.match(/(\d+\.?\d*)$/);
      if (match && match[0].includes('.')) return;
      
      // Don't allow multiple consecutive dots
      if (last === '.') return;
    }

    // Prevent invalid sequences
    if (char === '(') {
      // Add multiplication before ( if needed
      if (/[\d)πℯ]$/.test(cur)) {
        setResult(cur + '*' + char);
        return;
      }
    }

    if (char === ')') {
      // Don't allow ) if no matching (
      const openParens = (cur.match(/\(/g) || []).length;
      const closeParens = (cur.match(/\)/g) || []).length;
      if (openParens <= closeParens) return;
      
      // Don't allow ) immediately after operators or (
      if (ops.has(last) || last === '(') return;
    }

    // Handle digits
    if (/\d/.test(char)) {
      // Add multiplication before digits if needed after ) or constants
      if (/[)πℯ]$/.test(cur)) {
        setResult(cur + '*' + char);
        return;
      }
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
    
    // Prevent expressions that are too long
    if (cur.length > 190) return;
    
    const last = cur.slice(-1);
    const needsMul = /[\d)πℯ]$/.test(cur);
    
    // Validate function name
    const validFunctions = ['sin', 'cos', 'tan', 'ln', 'log', 'sqrt'];
    if (!validFunctions.includes(name)) return;
    
    // Don't insert function after operators (except for negative)
    if (ops.has(last) && last !== '-' && cur !== '') {
      return;
    }
    
    setResult(cur + (needsMul ? '*' : '') + name + '(');
  };

  const insertConst = (sym: string) => {
    const cur = state.result === '0' ? '' : state.result;
    
    // Prevent expressions that are too long
    if (cur.length > 190) return;
    
    const last = cur.slice(-1);
    const needsMul = /[\d)πℯ]$/.test(cur);
    
    // Validate constant symbol
    const validConstants = ['π', 'ℯ'];
    if (!validConstants.includes(sym)) return;
    
    // Don't insert constant after operators (except for negative)
    if (ops.has(last) && last !== '-' && cur !== '') {
      return;
    }
    
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
    if (!cur || cur === '0') return;
    
    // Prevent expressions that are too long
    if (cur.length > 180) return;
    
    const m = cur.match(/(\([^()]*\)|\d+\.?\d*|π|ℯ)$/);
    if (!m) return;
    
    const target = m[0];
    const replacement = target.length === 1 ? target + '^2' : '(' + target + ')^2';
    setResult(cur.replace(/(\([^()]*\)|\d+\.?\d*|π|ℯ)$/, replacement));
  };

  const sqrt = () => {
    const cur = state.result;
    
    // Prevent expressions that are too long
    if (cur.length > 180) return;
    
    const m = cur.match(/(\([^()]*\)|\d+\.?\d*|π|ℯ)$/);
    if (!m) {
      insertFn('sqrt');
      return;
    }
    
    const target = m[0];
    setResult(cur.replace(/(\([^()]*\)|\d+\.?\d*|π|ℯ)$/, 'sqrt(' + target + ')'));
  };

  const factorial = () => {
    const cur = state.result;
    if (!cur || cur === '0') return;
    
    // Prevent expressions that are too long
    if (cur.length > 190) return;
    
    const m = cur.match(/(\([^()]*\)|\d+\.?\d*|π|ℯ)$/);
    if (!m) return;
    
    // Check if we're already at the end of a factorial chain
    if (cur.endsWith('!')) return;
    
    setResult(cur + '!');
  };

  const preprocess = (expr: string): string => {
    // Enhanced validation for allowed characters
    if (!/^[-+*/^().,%\d\sπℯa-zA-Z!]+$/.test(expr))
      throw new Error('Invalid characters in expression');

    // Check for balanced parentheses
    let parenCount = 0;
    for (const char of expr) {
      if (char === '(') parenCount++;
      else if (char === ')') parenCount--;
      if (parenCount < 0) throw new Error('Unbalanced parentheses');
    }
    if (parenCount !== 0) throw new Error('Unbalanced parentheses');

    // Replace special symbols and operators
    expr = expr.replace(/%/g, '/100');
    expr = expr.replace(/π/g, 'Math.PI');
    expr = expr.replace(/ℯ/g, 'Math.E');
    expr = expr.replace(/\^/g, '**');

    // Handle factorial operations - process from right to left to handle nested factorials
    let factorialProcessed = false;
    do {
      const originalExpr = expr;
      expr = expr.replace(
        /(\([^()]*\)|\d+\.?\d*|Math\.PI|Math\.E)!/g,
        'FACT($1)'
      );
      factorialProcessed = originalExpr !== expr;
    } while (factorialProcessed);

    // Replace function names with uppercase versions for the safe eval context
    expr = expr
      .replace(/\bsin\(/g, 'SIN(')
      .replace(/\bcos\(/g, 'COS(')
      .replace(/\btan\(/g, 'TAN(')
      .replace(/\bln\(/g, 'LN(')
      .replace(/\blog\(/g, 'LOG(')
      .replace(/\bsqrt\(/g, 'Math.sqrt(');

    // Check for common invalid patterns
    if (/\*\*/g.test(expr.replace(/\*\*[^*]/g, ''))) {
      throw new Error('Invalid power operation');
    }
    
    // Check for empty parentheses
    if (/\(\s*\)/.test(expr)) {
      throw new Error('Empty parentheses not allowed');
    }

    return expr;
  };

  const safeEval = (expr: string): number => {
    const RAD = !state.degMode;
    const toRad = (x: number) => (x * Math.PI) / 180;
    const SIN = (x: number) => Math.sin(RAD ? x : toRad(x));
    const COS = (x: number) => Math.cos(RAD ? x : toRad(x));
    const TAN = (x: number) => Math.tan(RAD ? x : toRad(x));
    const LN = (x: number) => {
      if (x <= 0) throw new Error('Natural log of non-positive number');
      return Math.log(x);
    };
    const LOG = (x: number) => {
      if (x <= 0) throw new Error('Log of non-positive number');
      return Math.log10(x);
    };
    const FACT = (n: number) => {
      if (!Number.isFinite(n) || n < 0 || Math.floor(n) !== n)
        throw new Error('Invalid factorial');
      if (n > 170) throw new Error('Factorial too large');
      let r = 1;
      for (let i = 2; i <= n; i++) r *= i;
      return r;
    };

    // Create a safe evaluation context with all required functions
    const context = {
      Math,
      SIN,
      COS,
      TAN,
      LN,
      LOG,
      FACT,
      Infinity,
      NaN,
      isFinite: Number.isFinite,
      isNaN: Number.isNaN,
      parseInt: Number.parseInt,
      parseFloat: Number.parseFloat
    };

    // Create function with proper context
    const keys = Object.keys(context);
    const values = Object.values(context);
    
    // eslint-disable-next-line no-new-func
    const fn = Function(...keys, '"use strict"; return (' + expr + ')');
    return fn(...values);
  };

  const equals = () => {
    const exprRaw = state.result;
    if (!exprRaw || exprRaw === '0') return;

    try {
      const expr = preprocess(exprRaw);
      
      // Check for division by zero patterns before evaluation
      if (/\/\s*0(?![.\d])/.test(expr)) {
        throw new Error('Division by zero');
      }

      const val = safeEval(expr);
      
      // Enhanced validation for the result
      let out: number;
      if (!Number.isFinite(val)) {
        if (val === Infinity) throw new Error('Result is infinity');
        if (val === -Infinity) throw new Error('Result is negative infinity');
        throw new Error('Invalid result');
      } else {
        // Round to 12 decimal places to avoid floating point precision issues
        out = +parseFloat(val.toFixed(12));
        
        // Check if the result is too large or too small to display
        if (Math.abs(out) > 1e15) throw new Error('Result too large');
        if (Math.abs(out) < 1e-15 && out !== 0) out = 0; // Treat very small numbers as zero
      }

      setState((prev) => ({
        ...prev,
        history: exprRaw + ' =',
        result: String(out),
        lastAnswer: out,
      }));

      // Trigger success animation
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 800);

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Calculation error';
      setState((prev) => ({ 
        ...prev, 
        history: exprRaw + ' = Error', 
        result: 'Error'
      }));
      
      // Log error for debugging
      console.warn('Calculator error:', errorMessage);
      
      setTimeout(() => setResult('0'), 1500);
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
      <div className={`${styles.calculator} ${isSuccess ? styles.success : ''}`} role="application" aria-label="Calculator">
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
          <div className={`${styles.result} ${state.result === 'Error' ? styles.error : ''}`}>
            {state.result}
          </div>
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
