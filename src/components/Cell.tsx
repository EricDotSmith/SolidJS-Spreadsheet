import { Component, createSignal, createEffect, onCleanup, onMount, Show, createMemo } from "solid-js";
import { useSpreadsheetContext } from "./SpreadsheetProvider";
import { COLUMNS, evaluateExpression, getCellIndex } from "../utils/SpreadsheetUtils";

interface CellProps {
  row: number;
  column: number;
}

const Cell: Component<CellProps> = (props) => {
  const [showInput, setShowInput] = createSignal(false);
  const { cellValues, cellValuesComputed, updateCellValue, updateCellValueComputed } = useSpreadsheetContext();

  const cellIndex = getCellIndex(props.row, props.column, COLUMNS);

  let inputRef: HTMLInputElement | undefined = undefined;

  const evaluateCellValue = (value: string) => {
    if (value.startsWith("=")) {
      const expression = value.substring(1).toUpperCase();
      const evaluatedExpression = evaluateExpression(expression, cellValuesComputed, COLUMNS);

      updateCellValueComputed(cellIndex, evaluatedExpression);

      return;
    }

    updateCellValueComputed(cellIndex, value);
  };

  //TODO: (Refactor) This gets registered too many times
  // Function to handle outside click
  function handleOutsideClick(event: MouseEvent) {
    // console.log("handleOutsideClick");
    const inputElement = inputRef;
    if (inputElement && !inputElement.contains(event.target as Node)) {
      // Click occurred outside the input element
      setShowInput(false);
      //deal with capital case
      // evaluateCellValue(cellValues[cellIndex]);
    }
  }

  createEffect(() => {
    evaluateCellValue(cellValues[cellIndex]);
    console.log("cell: ", cellIndex);
  });

  onCleanup(() => {
    window.removeEventListener("click", handleOutsideClick);
  });

  onMount(() => {
    window.addEventListener("click", handleOutsideClick);
  });

  const gitLink = "link:https://github.com/EricDotSmith/SolidJS-Spreadsheet";
  const linkedInLink = "link:https://www.linkedin.com/in/ericdotsmith";
  const isGitLink = createMemo(() => {
    return cellValues[cellIndex] === gitLink || cellValues[cellIndex] === linkedInLink;
  });

  return (
    <>
      <Show when={isGitLink()}>
        <a
          href={cellValues[cellIndex].substring(5)}
          class="bg-gray-100 border-gray-700 flex border min-w-[8rem] h-6 items-center justify-center focus:border-blue-500 focus:border-2 focus:rounded-none focus:outline-none hover:text-blue-500"
        >
          Click here
        </a>
      </Show>
      <Show when={!showInput() && !isGitLink()}>
        <button
          ondblclick={() => {
            setShowInput(true);
            inputRef?.focus();
          }}
          class="bg-gray-100 border-gray-700 flex border min-w-[8rem] h-6 items-center justify-center focus:border-blue-500 focus:border-2 focus:rounded-none focus:outline-none"
        >
          {/* I: {cellIndex} : {props.row} : {props.column} : {cellValues[cellIndex]} */}
          {cellValuesComputed[cellIndex]}
        </button>
      </Show>
      <Show when={showInput()}>
        <input
          type="text"
          class="bg-gray-100 border-gray-700 flex border w-32 h-6 items-center justify-center focus:border-blue-500 focus:border-2 focus:rounded-none focus:outline-none"
          value={cellValues[cellIndex]}
          onInput={(e) => updateCellValue(cellIndex, (e.target as HTMLInputElement).value)}
          ref={inputRef}
        />
      </Show>
    </>
  );
};

export default Cell;
