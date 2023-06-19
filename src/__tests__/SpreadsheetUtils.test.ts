import { describe, expect, test } from "@jest/globals";
import {
  convertLetterCodeToNumber,
  generateLetterSequence,
  getCellIndex,
  getCellValueFromCellCode,
  getRowColumnFromCellCode,
  replaceCellCodesWithEvaluatedCellValues,
} from "../utils/SpreadsheetUtils";

const totalColumns = 4;

describe("Spreadsheet utils (execution engine)", () => {
  test("convertLetterCodeToNumber produces correct column indexes for letter code", () => {
    // Ex: A => 0, B => 1, C => 2, ..., Z => 25, AA => 26, AB => 27, ...
    const idxA = convertLetterCodeToNumber("A");
    const idxZ = convertLetterCodeToNumber("Z");
    const idxAA = convertLetterCodeToNumber("AA");
    const idxAB = convertLetterCodeToNumber("AB");

    expect(idxA).toBe(0);
    expect(idxZ).toBe(25);
    expect(idxAA).toBe(26);
    expect(idxAB).toBe(27);
  });

  test("getRowColumnFromCellCode produces correct row and column indexes for cell code", () => {
    // Ex: A => 0, B => 1, C => 2, ..., Z => 25, AA => 26, AB => 27, ...
    const rowColA1 = getRowColumnFromCellCode("A1");
    const rowColB20 = getRowColumnFromCellCode("B20");
    const rowColAA5 = getRowColumnFromCellCode("AA5");
    const rowColAB100 = getRowColumnFromCellCode("AB100");

    expect(rowColA1).toEqual({ row: 0, column: 0 });
    expect(rowColB20).toEqual({ row: 19, column: 1 });
    expect(rowColAA5).toEqual({ row: 4, column: 26 });
    expect(rowColAB100).toEqual({ row: 99, column: 27 });
  });

  test("getCellIndex produces correct index for row and column", () => {
    const idxA1 = getCellIndex(0, 0, totalColumns);
    const idxA2 = getCellIndex(1, 0, totalColumns);
    const idxD4 = getCellIndex(3, 3, totalColumns);
    const idxB1 = getCellIndex(0, 1, totalColumns);

    expect(idxA1).toBe(0);
    expect(idxA2).toBe(4);
    expect(idxD4).toBe(15);
    expect(idxB1).toBe(1);
  });

  test("getCellValueFromCellCode produces correct cell value for cell code", () => {
    const cellValues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

    const valueA1 = getCellValueFromCellCode("A1", cellValues, totalColumns);
    const valueA2 = getCellValueFromCellCode("A2", cellValues, totalColumns);
    const valueB1 = getCellValueFromCellCode("B1", cellValues, totalColumns);
    const valueD4 = getCellValueFromCellCode("D4", cellValues, totalColumns);

    expect(valueA1).toBe("1");
    expect(valueA2).toBe("5");
    expect(valueB1).toBe("2");
    expect(valueD4).toBe("16");
  });

  test("replaceCellCodesWithEvaluatedCellValues produces correct expression", () => {
    /*
        A    B    C    D
    1  "1", "2", "3", "4",
    2  "5", "6", "7", "8",
    3  "9", "10", "11", "12",
    4  "13", "14", "15", "16"
    */
    const cellValues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"];

    const expression = "(A2*    A1) + D3 / B1 / C1 - A1";
    const expectedExpression = "(5*    1) + 12 / 2 / 3 - 1";

    const evaluatedExpression = replaceCellCodesWithEvaluatedCellValues(expression, cellValues, totalColumns);

    expect(evaluatedExpression).toBe(expectedExpression);
  });

  test("generateLetterSequence produces correct letter sequence for number of columns", () => {
    const totalColumns = 25000;

    const letterSequence = generateLetterSequence(totalColumns);

    expect(letterSequence[0]).toBe("A");
    expect(letterSequence[25]).toBe("Z");
    expect(letterSequence[26]).toBe("AA");
    expect(letterSequence[27]).toBe("AB");
    expect(letterSequence[51]).toBe("AZ");
    expect(letterSequence[52]).toBe("BA");
    expect(letterSequence[53]).toBe("BB");
    expect(letterSequence[701]).toBe("ZZ");
    expect(letterSequence[totalColumns - 1]).toBe("AJYN");
  });
});
