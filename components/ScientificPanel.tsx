import styles from './Panel.module.css';
import RippleButton from './RippleButton';

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
      <RippleButton className={styles.muted} onClick={onClear} rippleColor="rgba(148, 163, 184, 0.5)">
        AC
      </RippleButton>
      <RippleButton className={styles.danger} onClick={onBackspace} rippleColor="rgba(253, 164, 175, 0.5)">
        DEL
      </RippleButton>
      <RippleButton onClick={onMemoryClear} title="Memory Clear">
        MC
      </RippleButton>
      <RippleButton onClick={onMemoryRecall} title="Memory Recall">
        MR
      </RippleButton>
      <RippleButton onClick={onAns} title="Insert previous answer">
        Ans
      </RippleButton>

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

      {/* Row 6 (final row) */}
      <RippleButton onClick={() => onAppend('4')}>4</RippleButton>
      <RippleButton onClick={() => onAppend('5')}>5</RippleButton>
      <RippleButton onClick={() => onAppend('6')}>6</RippleButton>
      <RippleButton className={styles.op} onClick={() => onAppend('+')} title="Plus" rippleColor="rgba(167, 139, 250, 0.6)">
        +
      </RippleButton>
      <RippleButton className={styles.op} onClick={() => onAppend('%')} title="Percent" rippleColor="rgba(167, 139, 250, 0.6)">
        %
      </RippleButton>

      <RippleButton onClick={() => onAppend('1')}>1</RippleButton>
      <RippleButton onClick={() => onAppend('2')}>2</RippleButton>
      <RippleButton onClick={() => onAppend('3')}>3</RippleButton>
      <RippleButton className={styles.span2} onClick={() => onAppend('0')}>
        0
      </RippleButton>
      <RippleButton onClick={() => onAppend('.')}>.</RippleButton>
      <RippleButton className={styles.equal} onClick={onEquals} title="Equals (Enter)" rippleColor="rgba(11, 16, 32, 0.8)">
        =
      </RippleButton>
    </div>
  );
}
