import styles from './Panel.module.css';

interface BasicPanelProps {
  onAppend: (char: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onPercent: () => void;
  onEquals: () => void;
}

export default function BasicPanel({
  onAppend,
  onClear,
  onBackspace,
  onPercent,
  onEquals,
}: BasicPanelProps) {
  return (
    <div className={styles.grid} aria-label="Basic keys">
      <button className={styles.muted} onClick={onClear} title="Clear (Esc)">
        AC
      </button>
      <button className={styles.danger} onClick={onBackspace} title="Delete (Backspace)">
        DEL
      </button>
      <button className={styles.op} onClick={onPercent} title="Percent">
        %
      </button>
      <button className={styles.op} onClick={() => onAppend('/')} title="Divide">
        ÷
      </button>

      <button onClick={() => onAppend('7')}>7</button>
      <button onClick={() => onAppend('8')}>8</button>
      <button onClick={() => onAppend('9')}>9</button>
      <button className={styles.op} onClick={() => onAppend('*')} title="Multiply">
        ×
      </button>

      <button onClick={() => onAppend('4')}>4</button>
      <button onClick={() => onAppend('5')}>5</button>
      <button onClick={() => onAppend('6')}>6</button>
      <button className={styles.op} onClick={() => onAppend('-')} title="Minus">
        −
      </button>

      <button onClick={() => onAppend('1')}>1</button>
      <button onClick={() => onAppend('2')}>2</button>
      <button onClick={() => onAppend('3')}>3</button>
      <button className={styles.op} onClick={() => onAppend('+')} title="Plus">
        +
      </button>

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
