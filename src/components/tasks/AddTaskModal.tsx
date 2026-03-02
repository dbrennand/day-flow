import { useAppContext } from '../../store/AppContext'
import { addTask } from '../../store/actions'
import type { Task } from '../../types'
import { Modal } from '../ui/Modal'
import { TaskForm } from './TaskForm'

interface AddTaskModalProps {
  onClose: () => void
}

export function AddTaskModal({ onClose }: AddTaskModalProps) {
  const { dispatch } = useAppContext()

  function handleSave(task: Task) {
    dispatch(addTask(task))
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-4 text-sm font-semibold text-stone-700">New Task</h2>
      <TaskForm onSave={handleSave} onCancel={onClose} />
    </Modal>
  )
}
