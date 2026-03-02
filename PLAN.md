# DayFlow — Initial Project Scaffold Plan

## Context

The DayFlow repository currently contains only the specification, roadmap, and LICENSE files. This plan seeds the project with a working Vite + React + TypeScript scaffold, Tailwind CSS configured with the full design system, a typed state layer (Context + useReducer + localStorage), core utility functions, and stub components for every planned feature — giving a running dev environment ready for feature development.

---

## Step 1 — Initialise the Vite project

Run from the repo root:

```
npm create vite@latest . -- --template react-ts
```

Then install all required dependencies in one pass:

```
npm install react-markdown @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install -D tailwindcss @tailwindcss/typography autoprefixer postcss
```

Delete generated boilerplate that will be replaced:
- `src/App.css`
- `src/index.css` (recreated with Tailwind directives)
- `src/App.tsx` (replaced)
- `public/vite.svg`
- `src/assets/react.svg`

---

## Step 2 — Tailwind CSS setup

**`tailwind.config.ts`** — encodes the entire visual language as design tokens:
- Custom colors: `cream`, `morning`/`midday`/`evening` time-of-day tints, `task.*` pastel accents
- Font: Inter (humanist sans-serif)
- Soft box shadows, rounded corners, and keyframe animations (`fade-in`, `slide-up`, `task-complete`)
- Plugin: `@tailwindcss/typography` (for `prose` classes used in react-markdown output)

**`postcss.config.js`** — standard tailwindcss + autoprefixer.

**`src/index.css`** — Tailwind directives + base layer setting `bg-cream-100 text-stone-700`.

**`index.html`** — add Inter font from Google Fonts (weights 300/400/500), set `<title>DayFlow</title>`.

---

## Step 3 — Types and constants

**`src/types/index.ts`** — all shared interfaces:
- `Task` — `{ id, name, startTime: "HH:MM", durationMinutes, notes?, completed, color }`
- `TaskColor` — union of 6 pastel color names
- `DaySettings` — `{ dayStartTime: "HH:MM", dayEndTime: "HH:MM" }`
- `AppState` — `{ tasks, settings, isFocusMode, activeTaskId, isSettingsOpen, isEndOfDay }`
- `AppAction` — discriminated union of all reducer actions

> Times are stored as `"HH:MM"` strings throughout (not Date objects) — trivially serialisable to localStorage, simple arithmetic.

**`src/constants/index.ts`** — `DEFAULT_DAY_START/END`, `DURATION_OPTIONS` array, `TASK_COLOR_ROTATION`, `OVERLOAD_THRESHOLD = 0.8`, `TIMELINE_SNAP_MINUTES = 15`, `NOW_INDICATOR_INTERVAL_MS = 30_000`.

---

## Step 4 — Utility functions

**`src/utils/time.ts`** — pure, side-effect-free time arithmetic:
- `toMinutes(hhmm)` / `fromMinutes(total)` — convert between "HH:MM" and minutes-from-midnight
- `nowHHMM()` — current time as "HH:MM"
- `taskToTimelinePosition(startTime, duration, dayStart, dayEnd)` — returns `{ left, width }` as percentages
- `nowToTimelinePercent(dayStart, dayEnd)` — position of the Now indicator (0–100%)
- `pixelToTime(pixelX, containerWidth, dayStart, dayEnd, snap=15)` — used by drag-and-drop
- `formatDisplayTime(hhmm)` — "HH:MM" → "9:30 AM"
- `getTimeOfDay(hhmm)` → `'morning' | 'midday' | 'evening'`
- `isOverloaded(tasks, dayStart, dayEnd, threshold)` — breathing room warning check

**`src/utils/storage.ts`**:
- `loadState(defaultState)` — reads `tasks` + `settings` from localStorage (used as `useReducer` initialiser)
- `saveState(state)` — persists `tasks` + `settings` only (not transient UI flags)
- `clearStorage()` — for Clear Day

---

## Step 5 — State layer

**`src/store/appReducer.ts`** — pure reducer, no side effects. Handles all `AppAction` types.

**`src/store/actions.ts`** — typed action-creator functions (`addTask`, `updateTask`, `deleteTask`, `toggleComplete`, `updateSettings`, `clearDay`, `setFocusMode`, `setActiveTask`, `setSettingsOpen`, `setEndOfDay`).

**`src/store/AppContext.tsx`** — `AppProvider` wraps the app, initialises state from localStorage via the reducer initialiser, persists state back on every change via `useEffect`. Exports `useAppContext()` typed hook.

---

## Step 6 — Custom hooks

**`src/hooks/useNow.ts`** — returns live `"HH:MM"` string, updates every 30 s via `setInterval`.

**`src/hooks/useLocalStorage.ts`** — generic `[value, setValue]` hook for one-off localStorage needs.

**`src/hooks/useTimelineUtils.ts`** — convenience hook wrapping `time.ts` functions with context's day settings pre-applied.

---

## Step 7 — UI primitives

**`src/components/ui/Button.tsx`** — `variant: 'primary' | 'ghost' | 'danger'`, extends `ButtonHTMLAttributes`.

**`src/components/ui/IconButton.tsx`** — icon-only button with accessible `aria-label`.

**`src/components/ui/Modal.tsx`** — overlay + centred card wrapper (used by confirmation dialogs).

**`src/components/ui/Badge.tsx`** — small pill (used for notes-present indicator on task blocks).

---

## Step 8 — Component stubs

Each file: correct imports, props interface, placeholder `<div>` with a descriptive label, default export. Enough to confirm the component tree compiles and renders.

```
src/components/
  layout/
    AppShell.tsx       — outer layout: Header + main area + conditional overlays
    Header.tsx         — app title, focus mode toggle, settings button
  timeline/
    Timeline.tsx       — full-width bar, maps tasks → TaskBlock, renders NowIndicator + TimeLabels
    TimelineBackground.tsx — time-of-day gradient layer
    NowIndicator.tsx   — live vertical "now" line
    TimeLabels.tsx     — hour markers along the bottom
    TaskBlock.tsx      — positioned pill; uses taskToTimelinePosition for inline style
  tasks/
    TaskPanel.tsx      — slide-in add/edit panel (open when activeTaskId set)
    TaskForm.tsx       — name + start time + duration + notes fields
    TaskNotes.tsx      — renders notes via <ReactMarkdown> with prose classes (fully implemented)
    AddTaskButton.tsx  — primary add affordance
  settings/
    SettingsPanel.tsx  — slide-in settings drawer
    DayBoundsForm.tsx  — start/end time pickers
  focus/
    FocusModeBanner.tsx — indicator when focus mode active
```

**`src/App.tsx`**:
```tsx
import { AppProvider } from './store/AppContext'
import { AppShell } from './components/layout/AppShell'
export default function App() {
  return <AppProvider><AppShell /></AppProvider>
}
```

---

## Critical files (must-write-first order)

1. `src/types/index.ts` — everything else depends on these interfaces
2. `src/constants/index.ts`
3. `src/utils/time.ts` — computational foundation of the timeline
4. `src/utils/storage.ts`
5. `src/store/appReducer.ts` → `src/store/actions.ts` → `src/store/AppContext.tsx`
6. `tailwind.config.ts` — incorrect config silently breaks all styling

---

## Verification

1. `npm run dev` — dev server starts at `localhost:5173`, zero terminal errors
2. **Tailwind active** — page background is warm off-white (`#faf8f0`), not browser default white
3. **Custom colors** — temporarily add `class="bg-task-blue"` and inspect computed colour (`#b8cfe8`)
4. **Context wired** — `console.log(state)` in `AppShell` shows `{ tasks: [], settings: { dayStartTime: '07:00', dayEndTime: '21:00' }, ... }`
5. **TypeScript clean** — `npx tsc --noEmit` returns zero errors
6. **Component tree** — no runtime errors; DOM tree matches `AppProvider > AppShell > Header + main`
