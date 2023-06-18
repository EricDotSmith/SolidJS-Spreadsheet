import { For, type Component, createSignal, createEffect, createContext, JSX, useContext } from "solid-js";
import { createStore } from "solid-js/store";

const App: Component = () => {
  return (
    <SpreadsheetProvider>
      <Sheet />
    </SpreadsheetProvider>
  );
};

const ROWS = 4;
const COLUMNS = 4;

interface SpreadsheetProviderContextState {
  cells: string[][];
  cellValues: string[];
  cellValuesComputed: string[];
  updateCellValue: (index: number, value: string) => void;
  updateCellValueComputed: (index: number, value: string) => void;
}

export const SpreadsheetContext = createContext<SpreadsheetProviderContextState>({} as SpreadsheetProviderContextState);

const SpreadsheetProvider: Component<{ children: JSX.Element }> = (props) => {
  const [cells, setCells] = createStore<string[][]>(new Array(ROWS).fill(new Array(COLUMNS).fill("")));
  const [cellValues, setCellValues] = createStore<string[]>(new Array(ROWS * COLUMNS).fill(""));
  const [cellValuesComputed, setCellValuesComputed] = createStore<string[]>(new Array(ROWS * COLUMNS).fill(""));

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

const useSpreadsheetContext = () => {
  const context = useContext(SpreadsheetContext);

  return context;
};

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

interface CellProps {
  row: number;
  column: number;
}
const Cell: Component<CellProps> = (props) => {
  const { cells, cellValues, updateCellValue } = useSpreadsheetContext();
  const cellIndex = (cells.length - 1) * props.row + (props.column + props.row);
  createEffect(() => {
    console.log("rendering cell: ", cellIndex, ":", cellValues[cellIndex]);
  });
  return (
    <div
      onClick={() => {
        updateCellValue(cellIndex, "hey");
      }}
      class="bg-gray-100 border-gray-700 flex border min-w-[8rem] h-6 items-center justify-center"
    >
      I: {cellIndex} : {props.row} : {props.column} : {cellValues[cellIndex]}
    </div>
  );
};

interface RowHeadersProps {
  rows: number;
}
const RowHeaders: Component<RowHeadersProps> = (props) => {
  const [list, setList] = createSignal<string[]>([]);

  createEffect(() => {
    setList(new Array(props.rows).fill("").map((_, i) => (i + 1).toString()));
  });

  return (
    <div class="flex flex-col">
      <For each={list()}>
        {(item) => (
          <div class="bg-gray-500 text-gray-100 border-gray-700 flex border w-8 h-6 items-center justify-center">
            {item}
          </div>
        )}
      </For>
    </div>
  );
};

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

export default App;

/*

import { QueryClient, QueryClientProvider, createQuery } from "@tanstack/solid-query";
import { createSignal, type Component, createEffect, Show, Match, Switch } from "solid-js";
import { createStore } from "solid-js/store";

const queryClient = new QueryClient();

const App: Component = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
};

const fetchSomeStuff = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
  return res.json();
};

// make a basic excel spreadsheet with a table of data

const Example: Component = () => {
  const [num, setNum] = createSignal(1);
  const [user, setUser] = createStore({ name: "John", age: 20 });
  const [nums, setNums] = createStore([1, 2, 3, 4, 5]);

  const query = createQuery(() => ["todos"], fetchSomeStuff, {
    get enabled() {
      return num() % 2 === 0;
    },
  });

  createEffect(() => {
    if (user.name === "ha") {
      console.log("works");
    }
    console.log("rendering");
  });

  createEffect(() => {
    console.log("pos 1 changed: ", nums[1]);
  });

  createEffect(() => {
    console.log("pos 2 changed: ", nums[2]);
  });

  createEffect(() => {
    console.log("whole nums array changed", nums);
  });
  return (
    <div>
      <button onClick={() => setNum(num() + 1)}>Click me</button>
      <Show when={num() % 2 === 0}>
        <h1 class="text-3xl font-bold underline">Hello world! {num()}</h1>;
      </Show>
      <input type="text" value={user.name} onInput={(e) => setUser("name", (e.target as HTMLInputElement).value)} />
      <input
        type="text"
        value={user.age}
        onInput={(e) => setUser("age", parseInt((e.target as HTMLInputElement).value))}
      />
      <div>
        Age: {user.age} Name: {user.name}
      </div>

      <button onClick={() => setNums(1, 10)}>change pos 1</button>
      <button onClick={() => setNums([1, 2, 3, 4, 5, 6, 7, 8])}>Assign new array</button>
      <button onClick={() => setNums(2, 3)}>change pos 2</button>

      <Switch>
        <Match when={query.isLoading}>Loading...</Match>
        <Match when={query.isSuccess}>
          <div>
            <h1>{query.data.userId}</h1>
            <p>{query.data.id}</p>
            <strong>👀 {query.data.title}</strong> <strong>✨ {query.data.stargazers_count}</strong>{" "}
            <strong>🍴 {query.data.completed}</strong>
          </div>
        </Match>
      </Switch>
    </div>
  );
};

export default App;


*/
