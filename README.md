# DayFlow

A calm, visually-driven daily planner for people who struggle with time awareness and task overwhelm.

DayFlow presents your day as a single, honest visual timeline — making the passage of time tangible and keeping your task load manageable. The experience is minimal, soft, and free of guilt.

> [!NOTE]
> This application was created entirely using [Claude Code](https://claude.ai/claude-code), powered by claude-sonnet-4-6.

## Features

- **Visual day timeline** — a full-width bar representing your day from start to end, with task blocks placed proportionally by time
- **Live "Now" indicator** — a soft vertical line that tracks the current moment in real time
- **Task management** — add, edit, move, and complete tasks with minimal friction; each task optionally supports Markdown notes
- **Focus mode** — zoom the timeline into just the next 2 hours when the full day feels like too much
- **Breathing room warning** — a gentle, dismissable nudge if your tasks fill more than ~80% of your available day
- **End-of-day summary** — a warm, non-judgmental summary when your day ends
- **Day settings** — configure your day start/end times and 12/24-hour clock preference; all data persists in local storage

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [@dnd-kit](https://dndkit.com/) for drag-and-drop timeline interactions
- [react-markdown](https://github.com/remarkjs/react-markdown) for task notes rendering

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Command            | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the dev server with hot reload |
| `npm run build`    | Type-check and build for production  |
| `npm run preview`  | Preview the production build locally |
| `npm run lint`     | Run ESLint                           |
| `npm run format`   | Format all files with Prettier       |
| `npm run lint:fix` | Format and auto-fix lint issues      |

## Data

All data (tasks and settings) is stored in the browser's local storage — no account, login, or server required. Use the **Clear Day** button in settings to reset tasks for a new day.
