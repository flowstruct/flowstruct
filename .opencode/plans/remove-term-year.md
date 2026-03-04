# Plan: Remove `year` from `Term` and use `termNumber` as sole ordering field

## Context
The `Term` domain object has both `termNumber` and `year` fields. The `year` on Term is purely an ordering mechanism (not a calendar year like the flowsheet-level `year`), making it redundant with `termNumber`. We'll remove `year` from Term entirely and use `termNumber` as the single source of truth for term ordering and prerequisite handling.

## Scope
- **In scope**: Java backend (Term, TermDto, TermUtils, FlowsheetDtoMapper) + SQL migration + CMS frontend types
- **Out of scope**: Content app (`CoursePlacement.year` is a different domain concept), flowsheet-level `year` (calendar year, stays)

## Changes

### 1. `api/src/main/java/com/flowstruct/api/flowsheet/domain/Term.java`
- Remove `private int year;` (line 24)
- Remove `this.year = other.year;` from copy constructor (line 34)

### 2. `api/src/main/java/com/flowstruct/api/flowsheet/dto/TermDto.java`
- Remove `int year` field (line 8)
- Rename `int position` to `int termNumber` (line 10)
- Result: `record TermDto(long id, int termNumber, String name, List<PlacementDto> placements)`

### 3. `api/src/main/java/com/flowstruct/api/flowsheet/utils/TermUtils.java`
- Simplify `compareTerms` method to just: `return Integer.compare(t1.getTermNumber(), t2.getTermNumber());`
- Remove the year comparison logic (lines 27-33)

### 4. `api/src/main/java/com/flowstruct/api/flowsheet/mapper/FlowsheetDtoMapper.java`
- Line 55: Change sort from `Comparator.comparing((Term t) -> t.getYear()).thenComparing(Term::getTermNumber)` to `Comparator.comparing(Term::getTermNumber)`
- Lines 59-60: Update `new TermDto(...)` call: remove `t.getYear()` arg, keep `t.getTermNumber()` as the `termNumber` parameter

### 5. `api/src/main/resources/db/migration/V20250902192125__init.sql`
- Remove `year INT NOT NULL` column from `term` table (line 94)
- Change `UNIQUE (flowsheet, year, termNumber)` to `UNIQUE (flowsheet, termNumber)` (line 96)

### 6. `client/apps/cms/src/features/flowsheet/domain/flowsheet.ts`
- On `Term` type: remove `year: number` (line 27), rename `position: number` to `termNumber: number` (line 28)

### 7. `client/apps/cms/src/features/flowsheet/domain/getPlacementState.ts`
- Line 69: Change `source.term.position >= target.term.position` to `source.term.termNumber >= target.term.termNumber`

### No changes needed
- `FlowsheetTermService.java` - doesn't reference `year` directly; uses `TermUtils.compareTerms()` which we're fixing
- `api.ts` - doesn't reference `year` on terms
- Content app types/utils - different domain concept
- `movePlacement.ts`, `placeCoursesInTerm.ts`, `getFlowsheetTerms.ts` - appear to be dead code referencing non-existent `flowsheet.placements`; leaving as-is
