import { useAppContext } from '../../store/AppContext'
import { toggleComplete, setActiveTask } from '../../store/actions'
import { toMinutes, fromMinutes, formatDisplayTime } from '../../utils/time'
import { useNow } from '../../hooks/useNow'
import type { TaskColor } from '../../types'

const colorMap: Record<TaskColor, string> = {
  blue: 'bg-[var(--color-task-blue)]',
  green: 'bg-[var(--color-task-green)]',
  yellow: 'bg-[var(--color-task-yellow)]',
  pink: 'bg-[var(--color-task-pink)]',
  purple: 'bg-[var(--color-task-purple)]',
  orange: 'bg-[var(--color-task-orange)]',
}

export function TaskAgenda() {
  const { state, dispatch } = useAppContext()
  const { tasks, settings, isFocusMode } = state
  const { dayEndTime, use24Hour } = settings
  const now = useNow()

  const focusEnd = fromMinutes(Math.min(toMinutes(now) + 120, toMinutes(dayEndTime)))
  const visibleTasks = isFocusMode
    ? tasks.filter(t => {
        const start = toMinutes(t.startTime)
        const end = start + t.durationMinutes
        return end > toMinutes(now) && start < toMinutes(focusEnd)
      })
    : tasks

  if (visibleTasks.length === 0) {
    return (
      <p className="px-6 py-8 text-sm text-stone-400 text-center">
        No tasks yet — click <strong>+ Add Task</strong> to plan your day.
      </p>
    )
  }

  const sorted = [...visibleTasks].sort((a, b) => toMinutes(a.startTime) - toMinutes(b.startTime))

  return (
    <div>
      {sorted.map(task => (
        <div
          key={task.id}
          className="px-6 py-3 flex items-center gap-3 hover:bg-cream-100 cursor-pointer border-b border-cream-100"
          onClick={() => dispatch(setActiveTask(task.id))}
        >
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${colorMap[task.color]}`} />
          <span className={`flex-1 truncate text-sm ${task.completed ? 'line-through text-stone-400' : 'text-stone-700'}`}>
            {task.name}
          </span>
          <span className="text-xs text-stone-400 shrink-0">
            {use24Hour ? task.startTime : formatDisplayTime(task.startTime)} · {task.durationMinutes} min
          </span>
          <input
            type="checkbox"
            checked={task.completed}
            className="shrink-0 cursor-pointer"
            onChange={() => {}}
            onClick={e => {
              e.stopPropagation()
              dispatch(toggleComplete(task.id))
            }}
          />
        </div>
      ))}
    </div>
  )
}
