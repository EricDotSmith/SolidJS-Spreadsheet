import { createContext, Component, useContext } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";
import { createStore } from "solid-js/store";
import { COLUMNS, ROWS } from "../utils/SpreadsheetUtils";

interface SpreadsheetProviderContextState {
  cells: string[][];
  cellValues: string[];
  cellValuesComputed: string[];
  updateCellValue: (index: number, value: string) => void;
  updateCellValueComputed: (index: number, value: string) => void;
}

const SpreadsheetContext = createContext<SpreadsheetProviderContextState>({} as SpreadsheetProviderContextState);

export const SpreadsheetProvider: Component<{ children: JSX.Element }> = (props) => {
  // Used for easy rendering of the spreadsheet
  const [cells, setCells] = createStore<string[][]>(new Array(ROWS).fill(new Array(COLUMNS).fill("")));

  // Store the cell values in a flat array
  const [cellValues, setCellValues] = createStore<string[]>(new Array(ROWS * COLUMNS).fill(""));
  const [cellValuesComputed, setCellValuesComputed] = createStore<string[]>(new Array(ROWS * COLUMNS).fill(""));

  setCellValues(0, "CREATED BY");
  setCellValues(COLUMNS, "@ericdotsmith");

  setCellValues(1, "USING");
  setCellValues(COLUMNS + 1, "SolidJS");

  setCellValues(2, "GITHUB");
  setCellValues(COLUMNS + 2, "link:https://github.com/EricDotSmith/SolidJS-Spreadsheet");

  setCellValues(3, "LINKEDIN");
  setCellValues(COLUMNS + 3, "link:https://www.linkedin.com/in/ericdotsmith");

  const updateCellValue = (index: number, value: string) => {
    setCellValues(index, value);
  };

  const updateCellValueComputed = (index: number, value: string) => {
    setCellValuesComputed(index, value);
  };

  return (
    <SpreadsheetContext.Provider
      value={{
        cells,
        cellValues,
        cellValuesComputed,
        updateCellValue,
        updateCellValueComputed,
      }}
    >
      {props.children}
    </SpreadsheetContext.Provider>
  );
};

export const useSpreadsheetContext = () => {
  const context = useContext(SpreadsheetContext);

  return context;
};
