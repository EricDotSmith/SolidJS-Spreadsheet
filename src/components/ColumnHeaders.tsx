import { Component, createSignal, createEffect, For } from "solid-js";

interface ColumnHeadersProps {
  columns: number;
}
const ColumnHeaders: Component<ColumnHeadersProps> = (props) => {
  const [list, setList] = createSignal<string[]>([]);

  createEffect(() => {
    setList(new Array(props.columns).fill("").map((_, i) => String.fromCharCode(65 + i)));
  });

  return (
    <div class="flex">
      {/* spacer */}
      <div class="bg-gray-500 text-gray-100 border-gray-700 border min-w-[2rem] h-6"></div>
      <For each={list()}>
        {(item) => (
          <div class="bg-gray-500 text-gray-100 border-gray-700 flex border min-w-[8rem] h-6 items-center justify-center">
            {item}
          </div>
        )}
      </For>
    </div>
  );
};

export default ColumnHeaders;
