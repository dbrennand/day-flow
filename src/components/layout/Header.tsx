import { useState } from 'react'
import { useAppContext } from '../../store/AppContext'
import { setActiveTask, setFocusMode, setSettingsOpen } from '../../store/actions'
import { isOverloaded } from '../../utils/time'
import { OVERLOAD_THRESHOLD } from '../../constants'
import { Button } from '../ui/Button'
import { IconButton } from '../ui/IconButton'
import { AddTaskModal } from '../tasks/AddTaskModal'

export function Header() {
  const { state, dispatch } = useAppContext()
  const { tasks, settings, isFocusMode } = state
  const { dayStartTime, dayEndTime } = settings
  const [addTaskOpen, setAddTaskOpen] = useState(false)

  const overloaded = isOverloaded(tasks, dayStartTime, dayEndTime, OVERLOAD_THRESHOLD)

  function handleAddTask() {
    dispatch(setSettingsOpen(false))
    setAddTaskOpen(true)
  }

  function handleOpenSettings() {
    dispatch(setActiveTask(null))
    dispatch(setSettingsOpen(true))
  }

  return (
    <>
      <header className="border-cream-300 bg-cream-50 flex items-center justify-between gap-3 border-b px-6 py-3">
        <span className="shrink-0 text-base font-semibold text-stone-700">DayFlow</span>

        <div className="flex flex-1 items-center justify-end gap-2">
          {overloaded && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Breathing room low
            </span>
          )}

          <Button
            variant={isFocusMode ? 'primary' : 'ghost'}
            className={isFocusMode ? 'text-cream-50 shrink-0 bg-stone-700' : 'shrink-0'}
            onClick={() => dispatch(setFocusMode(!isFocusMode))}
          >
            {/* target / crosshair icon */}
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="8" cy="8" r="6" />
              <circle cx="8" cy="8" r="2" />
              <line x1="8" y1="2" x2="8" y2="0" />
              <line x1="8" y1="14" x2="8" y2="16" />
              <line x1="2" y1="8" x2="0" y2="8" />
              <line x1="14" y1="8" x2="16" y2="8" />
            </svg>
            Focus
          </Button>

          <Button variant="ghost" className="shrink-0" onClick={handleAddTask}>
            + Add Task
          </Button>

          <IconButton aria-label="Open settings" onClick={handleOpenSettings}>
            {/* gear / settings icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </IconButton>
        </div>
      </header>

      {addTaskOpen && <AddTaskModal onClose={() => setAddTaskOpen(false)} />}
    </>
  )
}
