import { useState, useEffect } from 'react'
import { useAppContext } from '../../store/AppContext'
import { addTask, updateTask, deleteTask, toggleComplete, setActiveTask } from '../../store/actions'
import type { Task } from '../../types'
import { formatDisplayTime } from '../../utils/time'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { TaskForm } from './TaskForm'
import { TaskNotes } from './TaskNotes'

export function TaskPanel() {
  const { state, dispatch } = useAppContext()
  const { activeTaskId, tasks } = state

  const isOpen = activeTaskId !== null
  const isNew = activeTaskId === 'new'
  const activeTask = isNew ? undefined : tasks.find((t) => t.id === activeTaskId)

  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    setMode(isNew ? 'edit' : 'view') // eslint-disable-line react-hooks/set-state-in-effect
    setShowDeleteConfirm(false)
  }, [activeTaskId, isNew])

  function handleClose() {
    dispatch(setActiveTask(null))
  }

  function handleSave(task: Task) {
    if (isNew) {
      dispatch(addTask(task))
    } else {
      dispatch(updateTask(task))
    }
    dispatch(setActiveTask(null))
  }

  function handleDelete() {
    if (activeTask) {
      dispatch(deleteTask(activeTask.id))
    }
    setShowDeleteConfirm(false)
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 animate-[fade-in_0.2s_ease-out] bg-black/10"
          onClick={handleClose}
        />
      )}

      {/* Panel */}
      <div
        className={`bg-cream-50 fixed top-0 right-0 bottom-0 z-40 flex w-80 flex-col shadow-[var(--shadow-panel)] transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="border-cream-200 flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-sm font-semibold text-stone-700">
            {isNew ? 'New Task' : mode === 'edit' ? 'Edit Task' : (activeTask?.name ?? '')}
          </h2>
          <button
            onClick={handleClose}
            className="text-stone-400 transition-colors hover:text-stone-600"
            aria-label="Close panel"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3" y2="13" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {(isNew || mode === 'edit') && (
            <TaskForm
              task={activeTask}
              onSave={handleSave}
              onCancel={isNew ? handleClose : () => setMode('view')}
            />
          )}

          {!isNew && mode === 'view' && activeTask && (
            <div className="space-y-4">
              {/* Time info */}
              <div className="space-y-1">
                <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">Time</p>
                <p className="text-sm text-stone-700">
                  {formatDisplayTime(activeTask.startTime)} · {activeTask.durationMinutes} min
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
                  <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">
                    Notes
                  </p>
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
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(false)}>
          <h3 className="mb-2 text-base font-semibold text-stone-700">Delete task?</h3>
          <p className="mb-5 text-sm text-stone-500">
            "{activeTask?.name}" will be permanently removed.
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
