import { Component, createSignal, createEffect, For } from "solid-js";
import { generateLetterSequence } from "../utils/SpreadsheetUtils";

interface ColumnHeadersProps {
  columns: number;
}
const ColumnHeaders: Component<ColumnHeadersProps> = (props) => {
  const [list, setList] = createSignal<string[]>([]);

  createEffect(() => {
    setList(generateLetterSequence(props.columns));
  });

  return (
    <div class="flex sticky top-0 z-10">
      {/* spacer */}
      <div class="bg-gray-500 text-gray-100 border-gray-700 border min-w-[2rem] h-6 fixed"></div>
      <div class="ml-8"></div>
      <For each={list()}>
        {(item) => (
          <div class="bg-sky-700 text-gray-100 border-gray-700 flex border min-w-[8rem] h-6 items-center justify-center">
            {item}
          </div>
        )}
      </For>
    </div>
  );
};

export default ColumnHeaders;
