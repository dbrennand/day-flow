# DayFlow — Application Specification

## Overview

DayFlow is a calm, visually-driven daily planner designed for people who struggle with time awareness and task overwhelm. It presents the day as a single, honest visual timeline — making the passage of time tangible and keeping the task load manageable. The experience is minimal, soft, and free of guilt.

---

## Goals

- Make the passage of time visible and intuitive
- Reduce overwhelm by limiting and simplifying task management
- Give the user a single, calm view of their day at any moment
- Be fast and frictionless to use throughout the day

---

## Target Platform

- Desktop web browser (primary)
- Tablet / iPad browser (primary — equal priority to desktop)
- The layout and interactions must be fully responsive and touch-friendly across both platforms
- Mobile phone support (secondary, not a priority)

### Responsive Design Considerations
- Touch targets (buttons, task blocks, drag handles) must be large enough for comfortable finger interaction on a tablet
- Drag and resize interactions on the timeline should support both mouse and touch events
- The timeline layout should adapt gracefully between desktop widescreen and tablet portrait/landscape orientations
- Font sizes and spacing should remain comfortable and readable at tablet screen sizes
- The settings panel and task entry form should be easy to interact with using touch, avoiding small or fiddly inputs

---

## Visual Design

### Style
- Minimal and soft
- Generous whitespace
- Gentle, muted color palette (soft creams, warm grays, dusty pastels)
- Smooth, subtle animations — nothing jarring
- No harsh edges; rounded corners throughout

### Color Behavior
- The timeline background shifts subtly in tone as the day progresses:
  - **Morning:** cool, calm tones (soft blues and lavenders)
  - **Midday:** neutral, clear tones (warm whites and light grays)
  - **Evening:** warm, winding-down tones (soft ambers and blush)
- Colors are gentle suggestions, never alarming

### Typography
- Clean, humanist sans-serif font
- Comfortable reading size — nothing too small
- Light font weights preferred to maintain softness

---

## Core Features

### 1. Visual Day Timeline

- The central UI element — a horizontal bar spanning the full width of the screen
- Represents the user's custom day from start time to end time
- Task blocks are placed on the timeline proportionally to their start time and duration
- A **"Now" indicator** (a soft vertical line) moves in real time across the timeline showing the current moment
- Past portions of the timeline fade gently to indicate elapsed time
- The timeline is always visible and updates live

### 2. Task Management

#### Adding a Task
- Accessible via a clearly visible but unobtrusive "Add Task" button
- Task entry requires only three fields, with one optional field:
  - **Task name** (short text, required)
  - **Start time** (time picker, required)
  - **Duration** (simple selector, e.g. 15 min, 30 min, 1 hr, custom, required)
  - **Notes** (free-form text area, optional)
- No categories, tags, priorities, or extra metadata
- Task is placed on the timeline immediately upon saving

#### Task Notes
- Each task has an optional notes field for capturing any relevant context, instructions, or reminders related to that task
- Notes are written in plain text with **Markdown support** — common formatting such as bold, italic, bullet lists, and links will render when the note is viewed
- The notes field is in **edit/write mode** while adding or editing a task, and switches to **rendered view mode** when the task panel is simply being viewed
- Notes are visible by clicking on a task block to open its detail panel
- A small indicator (e.g. a subtle icon) on the task block signals that notes are present, so the user knows there is more detail available without cluttering the timeline

#### Editing a Task
- Clicking a task block opens a simple edit panel with the same three fields
- Tasks can be dragged along the timeline to adjust their start time
- Task blocks can be resized by dragging their edge to adjust duration

#### Completing a Task
- Each task has a simple completion toggle (e.g. a soft checkmark button)
- Completed tasks are visually softened on the timeline (reduced opacity, gentle strikethrough on label) but remain visible for context
- A satisfying, subtle animation plays on completion (e.g. a gentle pulse or fade)

#### Deleting a Task
- Available within the task edit panel
- A simple confirmation to prevent accidental deletion

#### Task Limit & Breathing Room Warning
- A soft warning appears if the user's tasks fill more than ~80% of their available day
- Warning is friendly in tone, not alarming: e.g. *"That's a full day — you might want some breathing room."*
- The user can dismiss the warning and proceed; it is advisory only

### 3. Focus Mode

- A toggle that zooms the timeline view into just the next 2 hours
- Hides the full-day view and shows only what's immediately ahead
- Easy to toggle back to the full day view
- Useful when the full timeline feels like too much to process at once

### 4. Day Settings

- Accessible via a settings icon (subtle, tucked into a corner)
- User can set:
  - **Day start time** (e.g. 7:00 AM)
  - **Day end time** (e.g. 9:00 PM)
- Changes apply immediately and the timeline redraws to match
- Settings are saved locally so they persist between sessions

### 5. End-of-Day Summary

- When the current time reaches the user's set day end time, a gentle summary screen appears
- Displays:
  - Number of tasks completed
  - A short, warm, non-judgmental message (e.g. *"You made it through the day. Rest well."*)
- Does not show uncompleted tasks or imply failure
- Dismissable; returns to the normal timeline view

---

## Technology Stack

### Frontend Framework
- **React** — component-based UI for managing the live, dynamic timeline and interactive task elements
- **Tailwind CSS** — utility-first styling to keep the design consistent, responsive, and easy to maintain

### Supporting Libraries
- **react-markdown** — for rendering Markdown in task notes
- **@dnd-kit** — modern, touch-friendly drag-and-drop library for moving and resizing task blocks on the timeline; supports both mouse and touch events, making it ideal for iPad use

### Build Tool
- **Vite** — fast, lightweight build tool well-suited for React projects; simple to configure and produces optimised output ready for deployment

---

## Hosting & Deployment

- The application will be hosted on a personal server under a custom domain, making it accessible from any device and browser (desktop, iPad, etc.)
- Since the app has no backend, the server only needs to serve static files (the compiled React app)
- Deployment involves building the app with Vite and uploading the output to the server
- HTTPS should be enabled on the domain so the app loads securely in all browsers

---

## Data Persistence

- All data (tasks, settings) is stored in the browser's **local storage**
- No account creation, login, or server required
- Data persists across sessions on the same device and browser
- A simple **"Clear Day"** button (in settings) allows the user to reset tasks for a new day

---

## What This App Is Not

- Not a notification or reminder system
- Not a recurring task or habit tracker
- Not a calendar or scheduling tool
- Not a collaboration tool
- Not a source of guilt — overdue or incomplete tasks are never highlighted negatively

---

## Roadmap

Future feature ideas and post-V1 considerations are tracked separately in `day-flow-roadmap.md`.

---

## Summary

DayFlow is intentionally simple. Every design and feature decision should be filtered through two questions: *Does this reduce overwhelm?* and *Does this make time more visible?* If a feature doesn't serve one of those goals, it doesn't belong in the app.
