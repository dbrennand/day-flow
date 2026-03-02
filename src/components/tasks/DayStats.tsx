import { useAppContext } from '../../store/AppContext'
import { toMinutes } from '../../utils/time'

function formatDuration(min: number): string {
  if (min >= 60) {
    const h = Math.floor(min / 60)
    const m = min % 60
    return m === 0 ? `${h}h` : `${h}h ${m}m`
  }
  return `${min}m`
}

export function DayStats() {
  const { state } = useAppContext()
  const { tasks, settings } = state
  const { dayStartTime, dayEndTime } = settings

  if (tasks.length === 0) return null

  const totalScheduledMin = tasks.reduce((s, t) => s + t.durationMinutes, 0)
  const daySpanMin = toMinutes(dayEndTime) - toMinutes(dayStartTime)
  const freeMin = Math.max(0, daySpanMin - totalScheduledMin)
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="border-cream-200 flex items-center gap-4 border-b px-6 py-3 text-sm text-stone-500">
      <span>
        <strong className="text-stone-700">{formatDuration(totalScheduledMin)}</strong> scheduled
      </span>
      <span className="text-cream-300">·</span>
      <span>
        <strong className="text-stone-700">{formatDuration(freeMin)}</strong> free
      </span>
      <span className="text-cream-300">·</span>
      <span>
        <strong className="text-stone-700">
          {completedCount} / {tasks.length}
        </strong>{' '}
        done
      </span>
    </div>
  )
}
