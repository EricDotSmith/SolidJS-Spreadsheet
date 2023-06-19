import { evaluate } from "mathjs";

const ROWCOLSIZE = 50;

// As of right now these must be a square
export const ROWS = ROWCOLSIZE;
export const COLUMNS = ROWCOLSIZE;

// Converts header uppercase letter to column number
// Ex: A => 0, B => 1, C => 2, ..., Z => 25, AA => 26, AB => 27, ...
export function convertLetterCodeToNumber(letterCode: string): number {
  const base = "A".charCodeAt(0) - 1;
  let result = 0;

  for (let i = 0; i < letterCode.length; i++) {
    const char = letterCode[i];
    const position = char.charCodeAt(0) - base;

    result = result * 26 + position;
  }

  return result - 1;
}

// Returns the row and column of a cell given its code
// Ex: A1 => [0, 0], B2 => [1, 1], C3 => [2, 2], ...
export function getRowColumnFromCellCode(cellCode: string): { row: number; column: number } | undefined {
  //split the cell code into letters and numbers
  const regex = /([A-Z]+)(\d+)/g;
  const match = regex.exec(cellCode);

  if (!match) {
    return undefined;
  }

  const [_, letters, numbers] = match;
  const row = Number(numbers) - 1;
  const column = convertLetterCodeToNumber(letters);

  return { row, column };
}

// Maps the row and column number to the index of the cell in the array
export const getCellIndex = (row: number, column: number) => (COLUMNS - 1) * row + (column + row);

// Returns the value of the cell for the given cell code
export function getCellValueFromCellCode(cellCode: string, cellValues: string[]): string | undefined {
  const cell = getRowColumnFromCellCode(cellCode);

  if (!cell) {
    return undefined;
  }

  const { row, column } = cell;

  const cellValue = cellValues[getCellIndex(row, column)];

  return cellValue;
}

// Replaces the cell codes in the expression with the evaluated cell values
export function replaceCellCodesWithEvaluatedCellValues(expression: string, evaluatedCellValues: string[]): string {
  const regex = /([A-Z]+)(\d+)/g;

  return expression.replace(regex, (_, letters: string, numbers: string) => {
    const code = letters.toUpperCase() + numbers;

    const value = getCellValueFromCellCode(code, evaluatedCellValues);

    return value !== undefined ? String(value) : code;
  });
}

// Evaluates the expression and returns the result
export function evaluateExpression(expression: string, cellValues: string[]): string {
  const expressionWithEvaluatedCellValues = replaceCellCodesWithEvaluatedCellValues(expression, cellValues);

  try {
    const result = evaluate(expressionWithEvaluatedCellValues);

    return String(result);
  } catch (error) {
    return "#ERROR";
  }
}
