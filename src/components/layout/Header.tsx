import { useAppContext } from '../../store/AppContext'
import { setActiveTask, setFocusMode, setSettingsOpen } from '../../store/actions'
import { isOverloaded } from '../../utils/time'
import { OVERLOAD_THRESHOLD } from '../../constants'
import { Button } from '../ui/Button'
import { IconButton } from '../ui/IconButton'

export function Header() {
  const { state, dispatch } = useAppContext()
  const { tasks, settings, isFocusMode } = state
  const { dayStartTime, dayEndTime } = settings

  const overloaded = isOverloaded(tasks, dayStartTime, dayEndTime, OVERLOAD_THRESHOLD)

  function handleAddTask() {
    dispatch(setSettingsOpen(false))
    dispatch(setActiveTask('new'))
  }

  function handleOpenSettings() {
    dispatch(setActiveTask(null))
    dispatch(setSettingsOpen(true))
  }

  return (
    <header className="flex items-center justify-between border-b border-cream-300 bg-cream-50 px-6 py-3 gap-3">
      <span className="text-base font-semibold text-stone-700 shrink-0">DayFlow</span>

      <div className="flex items-center gap-2 flex-1 justify-end">
        {overloaded && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Breathing room low
          </span>
        )}

        <Button
          variant={isFocusMode ? 'primary' : 'ghost'}
          className={isFocusMode ? 'bg-stone-700 text-cream-50 shrink-0' : 'shrink-0'}
          onClick={() => dispatch(setFocusMode(!isFocusMode))}
        >
          {/* target / crosshair icon */}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
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
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="8" cy="8" r="2.5" />
            <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" />
          </svg>
        </IconButton>
      </div>
    </header>
  )
}
