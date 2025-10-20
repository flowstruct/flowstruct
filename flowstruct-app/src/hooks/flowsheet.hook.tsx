import React, {useContext} from 'react';
import type {Flowsheet, Placement} from "../types/flowsheet.types.ts";
import {getFlowsheetTerms} from "../utils/getFlowsheetTerms.ts";

type FlowsheetContextValues = {
    flowsheet: Flowsheet;
    selectedCourses: Set<string>;
    toggleSelectCourse: (courseId: string) => void;
    isSelectedCourse: (courseId: string) => boolean;
    clearSelectedCourses: () => void;
    onCourseSelectionChange: (selection: Set<string>) => void;
    terms: Record<string, Placement[]>;
    createTerm: () => void;
    validateTerms: (courseId: string) => void;
    validTerms: string[] | null;
    focusedCourse: string | null;
    toggleFocusCourse: (courseId: string) => void;
    isFocusedCourse: (courseId: string) => boolean;
    clearFocusedCourse: () => void;
};

const FlowsheetContext = React.createContext<FlowsheetContextValues | undefined>(undefined);

type FlowsheetProviderProps = {
    children: React.ReactNode;
};

export function FlowsheetProvider({children}: FlowsheetProviderProps) {
    const flowsheet = JSON.parse(localStorage.getItem('flowsheet') ?? '{}') as Flowsheet;

    const [focusedCourse, setFocusedCourse] = React.useState<string | null>(null);
    const [selectedCourses, setSelectedCourses] = React.useState<Set<string>>(new Set());
    const [allPossibleTermsCount, setAllPossibleTermsCount] = React.useState<number>(
        Math.max(...Object.keys(getFlowsheetTerms(flowsheet)).map(Number))
    );

    const [validTerms, setValidTerms] = React.useState<number[] | null>(null);

    const toggleFocusCourse = (courseId: string) => {
        if (courseId === focusedCourse) {
            setFocusedCourse(null);
            return;
        }

        setFocusedCourse(courseId);
    };

    const isFocusedCourse = (courseId: string) => courseId === focusedCourse;

    const clearFocusedCourse = () => setFocusedCourse(null);

    const toggleSelectCourse = (courseId: string) => {
        if (focusedCourse) {
            setFocusedCourse(null);
        }

        setSelectedCourses((prev) => {
            const updated = new Set(prev);

            if (updated.has(courseId)) updated.delete(courseId);
            else updated.add(courseId);

            return updated;
        });
    };

    const onCourseSelectionChange = (selection: Set<string>) => {
        setSelectedCourses(selection);
    };

    const validateTerms = (courseId: string) => {
        console.log(courseId);
        setValidTerms([1, 2, 3]);
    };

    const clearSelectedCourses = () => setSelectedCourses(new Set());

    const isSelectedCourse = (courseId: string) => selectedCourses.has(courseId);

    const terms = React.useMemo(() => {
        const baseTerms = getFlowsheetTerms(flowsheet);

        for (let i = 1; i <= allPossibleTermsCount; i++) {
            baseTerms[i] = [...(baseTerms[i] ?? [])];
        }

        return baseTerms;
    }, [flowsheet, allPossibleTermsCount]);

    const createTerm = () => setAllPossibleTermsCount((prev) => prev + 1);

    return (
        <FlowsheetContext.Provider
            value={{
                flowsheet,
                selectedCourses,
                toggleSelectCourse,
                isSelectedCourse,
                clearSelectedCourses,
                onCourseSelectionChange,
                terms,
                validateTerms,
                validTerms,
                createTerm,
                focusedCourse,
                toggleFocusCourse,
                isFocusedCourse,
                clearFocusedCourse,
            }}
        >
            {children}
        </FlowsheetContext.Provider>
    );
}

export const useFlowsheet = () => {
    const context = useContext(FlowsheetContext);
    if (!context)
        throw new Error('useFlowsheet must be used within FlowsheetProvider.');
    return context;
};
