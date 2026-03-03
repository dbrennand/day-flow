interface AddTaskButtonProps {
  onClick: () => void
}

export function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <button onClick={onClick} className="p-4 text-sm text-stone-400 underline">
      + Add task
    </button>
  )
}
