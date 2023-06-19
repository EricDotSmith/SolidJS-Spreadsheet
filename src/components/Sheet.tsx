import { Component, For } from "solid-js";
import { useSpreadsheetContext } from "./SpreadsheetProvider";
import RowHeaders from "./RowHeaders";
import ColumnHeaders from "./ColumnHeaders";
import Cell from "./Cell";

const Sheet: Component = () => {
  const { cells } = useSpreadsheetContext();
  return (
    <div class="">
      <ColumnHeaders columns={cells[0].length} />
      <div class="flex">
        <RowHeaders rows={cells.length} />
        {/* naming of rowIndex and colIndex mixed up I think */}
        <For each={cells}>
          {(row, colIndex) => (
            <div>
              <For each={row}>{(_cell, rowIndex) => <Cell row={rowIndex()} column={colIndex()} />}</For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default Sheet;
