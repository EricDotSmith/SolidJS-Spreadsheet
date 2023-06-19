import { Component, createSignal, createEffect, onCleanup, onMount, createMemo, Show } from "solid-js";
import { COLUMNS, useSpreadsheetContext } from "./SpreadsheetProvider";

interface CellProps {
  row: number;
  column: number;
}
const Cell: Component<CellProps> = (props) => {
  const [showInput, setShowInput] = createSignal(false);
  const { cells, cellValues, cellValuesComputed, updateCellValue } = useSpreadsheetContext();
  const cellIndex = (cells.length - 1) * props.row + (props.column + props.row);
  createEffect(() => {
    console.log("rendering cell: ", cellIndex, ":", cellValues[cellIndex]);
  });
  let inputRef: HTMLInputElement | undefined = undefined;

  // Function to handle outside click
  function handleOutsideClick(event: MouseEvent) {
    const inputElement = inputRef;
    if (inputElement && !inputElement.contains(event.target as Node)) {
      // Click occurred outside the input element
      setShowInput(false);
    }
  }

  onCleanup(() => {
    window.removeEventListener("click", handleOutsideClick);
  });

  // Add click event listener when the component is mounted
  onMount(() => {
    window.addEventListener("click", handleOutsideClick);
  });

  const computeCellValue = (value: string) => {
    if (value.startsWith("=")) {
      return "";
    }
    return value;
  };

  const computedCellValue = createMemo(() => {
    return computeCellValue(cellValues[cellIndex]);
  });

  return (
    <>
      <Show when={!showInput()}>
        <button
          ondblclick={() => {
            // updateCellValue(cellIndex, "hey");
            setShowInput(true);
            inputRef?.focus();
          }}
          class="bg-gray-100 border-gray-700 flex border min-w-[8rem] h-6 items-center justify-center focus:border-blue-500 focus:border-2 focus:rounded-none focus:outline-none"
        >
          {/* I: {cellIndex} : {props.row} : {props.column} : {cellValues[cellIndex]} */}
          {computedCellValue()}
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
