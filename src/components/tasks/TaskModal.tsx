import { useState, useEffect } from 'react'
import { useAppContext } from '../../store/AppContext'
import { updateTask, deleteTask, toggleComplete, setActiveTask } from '../../store/actions'
import type { Task } from '../../types'
import { formatDisplayTime } from '../../utils/time'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { TaskForm } from './TaskForm'
import { TaskNotes } from './TaskNotes'

export function TaskModal() {
  const { state, dispatch } = useAppContext()
  const { activeTaskId, tasks, settings } = state
  const { use24Hour } = settings
  const activeTask = tasks.find((t) => t.id === activeTaskId)

  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    setMode('view') // eslint-disable-line react-hooks/set-state-in-effect
    setShowDeleteConfirm(false)
  }, [activeTaskId])

  if (!activeTaskId || !activeTask) return null

  function handleClose() {
    dispatch(setActiveTask(null))
  }

  function handleSave(task: Task) {
    dispatch(updateTask(task))
    dispatch(setActiveTask(null))
  }

  function handleDelete() {
    dispatch(deleteTask(activeTask!.id))
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <Modal onClose={handleClose}>
        <h2 className="mb-4 text-sm font-semibold text-stone-700">
          {mode === 'edit' ? 'Edit Task' : activeTask.name}
        </h2>

        {mode === 'edit' && (
          <TaskForm task={activeTask} onSave={handleSave} onCancel={() => setMode('view')} />
        )}

        {mode === 'view' && (
          <div className="space-y-4">
            {/* Time */}
            <div className="space-y-1">
              <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">Time</p>
              <p className="text-sm text-stone-700">
                {formatDisplayTime(activeTask.startTime, use24Hour)} · {activeTask.durationMinutes}{' '}
                min
              </p>
            </div>

            {/* Completion toggle */}
            <button
              onClick={() => dispatch(toggleComplete(activeTask.id))}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                activeTask.completed ? 'text-green-700' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                  activeTask.completed ? 'border-green-600 bg-green-600' : 'border-stone-300'
                }`}
              >
                {activeTask.completed && (
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                  >
                    <polyline points="1.5,5 4,7.5 8.5,2.5" />
                  </svg>
                )}
              </span>
              {activeTask.completed ? 'Completed' : 'Mark complete'}
            </button>

            {/* Notes */}
            {activeTask.notes && (
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">Notes</p>
                <TaskNotes notes={activeTask.notes} />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button variant="ghost" className="flex-1" onClick={() => setMode('edit')}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(false)}>
          <h3 className="mb-2 text-base font-semibold text-stone-700">Delete task?</h3>
          <p className="mb-5 text-sm text-stone-500">
            "{activeTask.name}" will be permanently removed.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}
