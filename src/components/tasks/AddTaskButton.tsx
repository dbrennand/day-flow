interface AddTaskButtonProps {
  onClick: () => void
}

export function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <button
      onClick={onClick}
      className="text-stone-400 p-4 text-sm underline"
    >
      + Add task
    </button>
  )
}
