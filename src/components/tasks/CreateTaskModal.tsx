import { useState } from 'react'
import { useAppContext } from '../../store/AppContext'
import { addTask } from '../../store/actions'
import { TASK_COLOR_ROTATION } from '../../constants'
import { formatDisplayTime, fromMinutes, toMinutes } from '../../utils/time'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'

interface CreateTaskModalProps {
  startTime: string
  durationMinutes: number
  onClose: () => void
}

export function CreateTaskModal({ startTime, durationMinutes, onClose }: CreateTaskModalProps) {
  const { state, dispatch } = useAppContext()
  const { tasks, settings } = state
  const { use24Hour } = settings

  const [name, setName] = useState('')
  const [notes, setNotes] = useState('')

  const inputClass =
    'w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    dispatch(
      addTask({
        id: crypto.randomUUID(),
        name: name.trim(),
        startTime,
        durationMinutes,
        notes: notes.trim() || undefined,
        completed: false,
        color: TASK_COLOR_ROTATION[tasks.length % TASK_COLOR_ROTATION.length],
      })
    )
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <div className="mb-4">
        <h2 className="text-base font-semibold text-stone-800">New task</h2>
        <p className="mt-0.5 text-xs text-stone-500">
          {formatDisplayTime(startTime, use24Hour)} –{' '}
          {formatDisplayTime(fromMinutes(toMinutes(startTime) + durationMinutes), use24Hour)} ·{' '}
          {durationMinutes} min
        </p>
      </div>
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
            Add task
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  )
}
