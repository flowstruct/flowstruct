import {FlowsheetProvider} from "./hooks/flowsheet.hook.tsx";
import {Flowsheet} from "./components/flowsheet/flowsheet.tsx";

function App() {

    return (
        <FlowsheetProvider>
            <Flowsheet/>
        </FlowsheetProvider>
    );
}

export default App
