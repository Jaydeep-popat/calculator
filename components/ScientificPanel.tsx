import styles from './Panel.module.css';

interface ScientificPanelProps {
  onAppend: (char: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEquals: () => void;
  onSquare: () => void;
  onSqrt: () => void;
  onFactorial: () => void;
  onNegate: () => void;
  onInsertFn: (name: string) => void;
  onInsertConst: (sym: string) => void;
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onAns: () => void;
}

export default function ScientificPanel({
  onAppend,
  onClear,
  onBackspace,
  onEquals,
  onSquare,
  onSqrt,
  onFactorial,
  onNegate,
  onInsertFn,
  onInsertConst,
  onMemoryClear,
  onMemoryRecall,
  onAns,
}: ScientificPanelProps) {
  return (
    <div className={`${styles.grid} ${styles.sci}`} aria-label="Scientific keys">
      {/* Row 1 */}
      <button className={styles.muted} onClick={onClear}>
        AC
      </button>
      <button className={styles.danger} onClick={onBackspace}>
        DEL
      </button>
      <button onClick={onMemoryClear} title="Memory Clear">
        MC
      </button>
      <button onClick={onMemoryRecall} title="Memory Recall">
        MR
      </button>
      <button onClick={onAns} title="Insert previous answer">
        Ans
      </button>

      {/* Row 2 */}
      <button onClick={() => onAppend('(')}>(</button>
      <button onClick={() => onAppend(')')}>)</button>
      <button onClick={onSquare} title="Square">
        x²
      </button>
      <button onClick={onSqrt} title="Square root">
        √
      </button>
      <button className={styles.op} onClick={() => onAppend('^')} title="Power">
        x^y
      </button>

      {/* Row 3 */}
      <button onClick={() => onInsertConst('π')} title="Pi">
        π
      </button>
      <button onClick={() => onInsertConst('ℯ')} title="Euler e">
        e
      </button>
      <button onClick={onFactorial} title="Factorial">
        !
      </button>
      <button onClick={onNegate} title="Sign">
        ±
      </button>
      <button className={styles.op} onClick={() => onAppend('/')} title="Divide">
        ÷
      </button>

      {/* Row 4 */}
      <button onClick={() => onInsertFn('sin')}>sin</button>
      <button onClick={() => onInsertFn('cos')}>cos</button>
      <button onClick={() => onInsertFn('tan')}>tan</button>
      <button onClick={() => onInsertFn('ln')}>ln</button>
      <button onClick={() => onInsertFn('log')}>log</button>

      {/* Row 5 (digits/ops) */}
      <button onClick={() => onAppend('7')}>7</button>
      <button onClick={() => onAppend('8')}>8</button>
      <button onClick={() => onAppend('9')}>9</button>
      <button className={styles.op} onClick={() => onAppend('*')} title="Multiply">
        ×
      </button>
      <button className={styles.op} onClick={() => onAppend('-')} title="Minus">
        −
      </button>

      <button onClick={() => onAppend('4')}>4</button>
      <button onClick={() => onAppend('5')}>5</button>
      <button onClick={() => onAppend('6')}>6</button>
      <button className={styles.op} onClick={() => onAppend('+')} title="Plus">
        +
      </button>
      <button className={styles.op} onClick={() => onAppend('%')} title="Percent">
        %
      </button>

      <button onClick={() => onAppend('1')}>1</button>
      <button onClick={() => onAppend('2')}>2</button>
      <button onClick={() => onAppend('3')}>3</button>
      <button className={styles.span2} onClick={() => onAppend('0')}>
        0
      </button>
      <button onClick={() => onAppend('.')}>.</button>
      <button className={styles.equal} onClick={onEquals} title="Equals (Enter)">
        =
      </button>
    </div>
  );
}
