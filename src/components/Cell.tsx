import { Component, createSignal, createEffect, onCleanup, onMount, createMemo, Show } from "solid-js";
import { useSpreadsheetContext } from "./SpreadsheetProvider";
import { evaluateExpression, getCellIndex } from "../utils/SpreadsheetUtils";

interface CellProps {
  row: number;
  column: number;
}

const Cell: Component<CellProps> = (props) => {
  const [showInput, setShowInput] = createSignal(false);
  const { cellValues, cellValuesComputed, updateCellValue, updateCellValueComputed } = useSpreadsheetContext();
  const cellIndex = getCellIndex(props.row, props.column);
  // createEffect(() => {
  //   console.log("rendering cell: ", cellIndex, ":", cellValues[cellIndex]);
  // });
  // createEffect(() => {
  //   console.log("computed: ", cellIndex, ":", cellValuesComputed[cellIndex]);
  // });
  let inputRef: HTMLInputElement | undefined = undefined;

  const evaluateCellValue = (value: string) => {
    if (value.startsWith("=")) {
      const expression = value.substring(1);
      const evaluatedExpression = evaluateExpression(expression, cellValuesComputed);

      updateCellValueComputed(cellIndex, evaluatedExpression);

      return;
    }

    updateCellValueComputed(cellIndex, value);
  };

  //TODO: this gets registered on too many things
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
    // const d4Idx = getCellIndex(3, 3);
    // const d3Idx = getCellIndex(2, 3);
    // const ignore = cellValues[d4Idx] + cellValues[d3Idx];
    evaluateCellValue(cellValues[cellIndex].toUpperCase());
    console.log("cell: ", cellIndex);
  });

  onCleanup(() => {
    window.removeEventListener("click", handleOutsideClick);
  });

  onMount(() => {
    window.addEventListener("click", handleOutsideClick);
  });

  return (
    <>
      <Show when={!showInput()}>
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
