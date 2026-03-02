import { useEffect } from 'react'
import { useAppContext } from '../../store/AppContext'
import { setEndOfDay } from '../../store/actions'
import { toMinutes } from '../../utils/time'
import { useNow } from '../../hooks/useNow'
import { Header } from './Header'
import { Timeline } from '../timeline/Timeline'
import { TaskPanel } from '../tasks/TaskPanel'
import { SettingsPanel } from '../settings/SettingsPanel'
import { FocusModeBanner } from '../focus/FocusModeBanner'
import { Button } from '../ui/Button'

export function AppShell() {
  const { state, dispatch } = useAppContext()
  const { tasks, settings, isFocusMode, isEndOfDay } = state
  const { dayEndTime } = settings
  const now = useNow()

  useEffect(() => {
    if (
      toMinutes(now) >= toMinutes(dayEndTime) &&
      tasks.length > 0 &&
      !isEndOfDay
    ) {
      dispatch(setEndOfDay(true))
    }
  }, [now, dayEndTime, tasks.length, isEndOfDay, dispatch])

  const completedCount = tasks.filter(t => t.completed).length

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      {isFocusMode && <FocusModeBanner />}
      <main className="flex flex-1 flex-col">
        <Timeline />
      </main>
      <TaskPanel />
      <SettingsPanel />

      {/* End-of-day overlay */}
      {isEndOfDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-100/90 backdrop-blur-sm animate-[fade-in_0.3s_ease-out]">
          <div className="text-center space-y-4 animate-[slide-up_0.4s_ease-out]">
            {/* Moon icon */}
            <div className="flex justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-stone-400">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-stone-700">That's the day done.</h2>
              <p className="text-stone-500">
                {completedCount} of {tasks.length} task{tasks.length !== 1 ? 's' : ''} completed
              </p>
            </div>
            <p className="text-stone-400 text-sm">Rest well.</p>
            <Button
              variant="ghost"
              onClick={() => dispatch(setEndOfDay(false))}
              className="mt-2"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
