import styles from './app.module.css';
import { FlowsheetGrid } from './components/flowsheet/flowsheet-grid.tsx';
import { CoursesGraphProvider } from './hooks/courses-graph.hook.tsx';
import { CoursesProvider } from './hooks/courses.hook.tsx';
import { FlowsheetGridProvider } from './hooks/flowsheet-grid.hook.tsx';
import { FlowsheetProvider } from './hooks/flowsheet.hook.tsx';
import { PlacementsProvider } from './hooks/placements.hook.tsx';
import { TermsProvider } from './hooks/terms.hook.tsx';

function App() {
  return (
    <main className={styles.main}>
      <FlowsheetProvider>
        <CoursesProvider>
          <CoursesGraphProvider>
            <FlowsheetGridProvider>
              <TermsProvider>
                <PlacementsProvider>
                  <FlowsheetGrid />
                </PlacementsProvider>
              </TermsProvider>
            </FlowsheetGridProvider>
          </CoursesGraphProvider>
        </CoursesProvider>
      </FlowsheetProvider>
    </main>
  );
}

export default App;
