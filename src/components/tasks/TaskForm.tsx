import { useState } from 'react'
import type { Task } from '../../types'
import { useAppContext } from '../../store/AppContext'
import { DURATION_OPTIONS, TASK_COLOR_ROTATION } from '../../constants'
import { nowHHMM } from '../../utils/time'
import { Button } from '../ui/Button'

interface TaskFormProps {
  task?: Task
  onSave: (task: Task) => void
  onCancel: () => void
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} min`
  const hrs = mins / 60
  return hrs === 1 ? '1 hr' : `${hrs} hrs`
}

export function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const { state } = useAppContext()
  const { tasks } = state

  const [name, setName] = useState(task?.name ?? '')
  const [startTime, setStartTime] = useState(task?.startTime ?? nowHHMM())
  const [durationMinutes, setDurationMinutes] = useState(task?.durationMinutes ?? 30)
  const [notes, setNotes] = useState(task?.notes ?? '')

  const color = task?.color ?? TASK_COLOR_ROTATION[tasks.length % TASK_COLOR_ROTATION.length]
  const id = task?.id ?? crypto.randomUUID()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSave({
      id,
      name: name.trim(),
      startTime,
      durationMinutes,
      notes: notes.trim() || undefined,
      completed: task?.completed ?? false,
      color,
    })
  }

  const inputClass =
    'w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300'

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-medium tracking-wide text-stone-500 uppercase">
          Task name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="What are you working on?"
          className={inputClass}
          autoFocus
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-medium tracking-wide text-stone-500 uppercase">
            Start time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium tracking-wide text-stone-500 uppercase">
            Duration
          </label>
          <select
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            className={inputClass}
          >
            {DURATION_OPTIONS.map((mins) => (
              <option key={mins} value={mins}>
                {formatDuration(mins)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium tracking-wide text-stone-500 uppercase">
          Notes (markdown)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional notes…"
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={!name.trim()} className="flex-1">
          {task ? 'Save changes' : 'Add task'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
