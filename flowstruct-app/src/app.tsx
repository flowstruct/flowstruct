import { FlowsheetProvider } from './hooks/flowsheet.hook.tsx';
import { Flowsheet } from './components/flowsheet/flowsheet.tsx';
import styles from './app.module.css';
import { FlowsheetGridProvider } from './hooks/flowsheet-grid.hook.tsx';
import { CoursesGraphProvider } from './hooks/courses-graph.hook.tsx';

function App() {
  return (
    <main className={styles.main}>
      <FlowsheetProvider>
        <FlowsheetGridProvider>
          <CoursesGraphProvider>
            <Flowsheet />
          </CoursesGraphProvider>
        </FlowsheetGridProvider>
      </FlowsheetProvider>
    </main>
  );
}

export default App;
