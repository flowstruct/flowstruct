import styles from './flowsheet.module.css';
import {createPortal} from 'react-dom';
import {useKeyboard} from 'react-aria';
import {useFlowsheet} from "../../hooks/flowsheet.hook.tsx";
import {Box} from "../layout/box.tsx";
import Group from "../layout/group.tsx";
import {Tooltip, TooltipTrigger} from "../ui/Tooltip.tsx";
import {Button} from "../ui/Button.tsx";
import {Term} from "./term.tsx";
import { Grid2X2Plus } from 'lucide-react';
import {MultiSelectToolbar} from "./multi-select-toolbar.tsx";

export function Flowsheet() {
    const {terms, createTerm, clearFocusedCourse, clearSelectedCourses} = useFlowsheet();
    const {keyboardProps} = useKeyboard({
        onKeyDown: (e) => {
            if (e.key === 'Escape') {
                clearSelectedCourses();
                clearFocusedCourse();
            }
        },
    });

    return (
        <Box overflow="auto" overflowY="hidden" {...keyboardProps}>
            <Group align="start">
                {Object.entries(terms).map(([term, placements]) => (
                    <Term
                        key={term}
                        term={Number(term)}
                        placements={placements.sort((a, b) => a.position - b.position)}
                    />
                ))}

                <Box position="relative">
                    <TooltipTrigger>
                        <Button
                            variant="ghost"
                            size="xs"
                            shape="icon"
                            className={styles.addTermButton}
                            onPress={createTerm}
                        >
                            <Grid2X2Plus size={15}/>
                        </Button>
                        <Tooltip>Add term</Tooltip>
                    </TooltipTrigger>
                </Box>
            </Group>

            {createPortal(<MultiSelectToolbar/>, document.body)}
        </Box>
    );
}
