import { type Component } from "solid-js";
import { SpreadsheetProvider } from "./components/SpreadsheetProvider";
import Sheet from "./components/Sheet";

const App: Component = () => {
  return (
    <SpreadsheetProvider>
      <Sheet />
    </SpreadsheetProvider>
  );
};

export default App;
