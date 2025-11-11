export interface CalculatorState {
  result: string;
  history: string;
  degMode: boolean;
  memory: number;
  lastAnswer: number;
}

export interface Rates {
  [key: string]: number;
}
