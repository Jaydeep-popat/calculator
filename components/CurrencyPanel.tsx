'use client';

import { useState, useEffect } from 'react';
import styles from './CurrencyPanel.module.css';

interface CurrencyPanelProps {
  onSendToCalc: (value: number) => void;
  onUpdateHistory: (text: string) => void;
}

const defaultRates = {
  USD: 1,
  INR: 84.0,
  EUR: 0.92,
  GBP: 0.78,
  JPY: 151.0,
  AED: 3.67,
  AUD: 1.48,
  CAD: 1.36,
};

export default function CurrencyPanel({
  onSendToCalc,
  onUpdateHistory,
}: CurrencyPanelProps) {
  const [amount, setAmount] = useState('1');
  const [result, setResult] = useState('');
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [rates, setRates] = useState(defaultRates);
  const [ratesText, setRatesText] = useState(JSON.stringify(defaultRates, null, 2));

  useEffect(() => {
    convert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, fromCurrency, toCurrency, rates]);

  const convert = () => {
    const amt = parseFloat(amount || '0');
    if (!Number.isFinite(amt)) return;
    if (!(fromCurrency in rates) || !(toCurrency in rates)) return;

    // Convert from source currency to USD, then USD to target currency
    // rates[currency] = how many units of that currency equal 1 USD
    const amountInUSD = amt / rates[fromCurrency as keyof typeof rates];
    const out = amountInUSD * rates[toCurrency as keyof typeof rates];
    setResult(Number.isFinite(out) ? out.toFixed(4) : 'Error');
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  const handlePush = () => {
    const out = parseFloat(result || '0');
    const amt = parseFloat(amount || '0');
    onUpdateHistory(`${amt} ${fromCurrency} → ${toCurrency}`);
    onSendToCalc(out);
  };

  const handleApply = () => {
    try {
      const newRates = JSON.parse(ratesText);
      if (typeof newRates !== 'object' || !('USD' in newRates)) throw new Error();
      setRates(newRates);
    } catch {
      alert('Invalid JSON. Provide an object of { "USD":1, "INR":84, ... }');
    }
  };

  const handleReset = () => {
    setRates(defaultRates);
    setRatesText(JSON.stringify(defaultRates, null, 2));
  };

  const currencies = Object.keys(rates);

  return (
    <div className={styles.fx} aria-label="Currency converter">
      <div className={styles.fxRow}>
        <div>
          <label>Amount</label>
          <input
            type="number"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label>Result</label>
          <input type="text" value={result} readOnly />
        </div>
      </div>

      <div className={styles.fxRow}>
        <div>
          <label>From</label>
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>To</label>
          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencies.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.rowActions}>
        <button onClick={handleSwap}>Swap</button>
        <button onClick={handleCopy}>Copy Result</button>
        <button onClick={handlePush}>Send to Calc</button>
      </div>

      <div className={styles.subtle}>
        Rates base: <strong>USD</strong>. These are sample placeholders—edit below.
      </div>
      <textarea
        rows={6}
        spellCheck={false}
        aria-label="Rates JSON"
        value={ratesText}
        onChange={(e) => setRatesText(e.target.value)}
      />
      <div className={styles.rowActions}>
        <button onClick={handleApply}>Edit rates</button>
        <button className={styles.muted} onClick={handleReset}>
          Reset rates
        </button>
      </div>
    </div>
  );
}
