import { Component, createSignal, createEffect, For } from "solid-js";

interface RowHeadersProps {
  rows: number;
}
const RowHeaders: Component<RowHeadersProps> = (props) => {
  const [list, setList] = createSignal<string[]>([]);

  createEffect(() => {
    setList(new Array(props.rows).fill("").map((_, i) => (i + 1).toString()));
  });

  return (
    <div class="flex flex-col sticky left-0">
      <For each={list()}>
        {(item) => (
          <div class="bg-sky-600 text-gray-100 border-gray-700 flex border w-8 h-6 items-center justify-center">
            {item}
          </div>
        )}
      </For>
    </div>
  );
};

export default RowHeaders;
