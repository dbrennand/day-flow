import { useRef, useState, useEffect, type RefObject } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Task, TaskColor } from '../../types'
import { useAppContext } from '../../store/AppContext'
import { updateTask, setActiveTask } from '../../store/actions'
import { taskToTimelinePosition, toMinutes } from '../../utils/time'
import { TIMELINE_SNAP_MINUTES } from '../../constants'

const colorMap: Record<TaskColor, string> = {
  blue: 'bg-[var(--color-task-blue)]',
  green: 'bg-[var(--color-task-green)]',
  yellow: 'bg-[var(--color-task-yellow)]',
  pink: 'bg-[var(--color-task-pink)]',
  purple: 'bg-[var(--color-task-purple)]',
  orange: 'bg-[var(--color-task-orange)]',
}

interface TaskBlockProps {
  task: Task
  dayStart: string
  dayEnd: string
  trackRef: RefObject<HTMLDivElement | null>
}

export function TaskBlock({ task, dayStart, dayEnd, trackRef }: TaskBlockProps) {
  const { dispatch } = useAppContext()
  const [localDuration, setLocalDuration] = useState(task.durationMinutes)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const prevCompleted = useRef(task.completed)

  // Sync localDuration when task prop changes (e.g., from drag end or external update)
  useEffect(() => {
    setLocalDuration(task.durationMinutes)
  }, [task.durationMinutes])

  // Trigger animation when completed toggles to true
  useEffect(() => {
    if (task.completed && !prevCompleted.current) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 400)
      prevCompleted.current = task.completed
      return () => clearTimeout(timer)
    }
    prevCompleted.current = task.completed
  }, [task.completed])

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })

  const { left, width } = taskToTimelinePosition(task.startTime, localDuration, dayStart, dayEnd)

  const clampedLeft = Math.max(0, left)
  const clampedWidth = Math.max(0, left < 0 ? width + left : width)
  const isClippedLeft = left < 0

  // Resize state
  const resizeState = useRef<{ startX: number; startDuration: number } | null>(null)

  // Don't render tasks that fall entirely outside the visible window (must be after all hooks)
  if (left + width <= 0 || left >= 100) return null

  function handleResizePointerDown(e: React.PointerEvent) {
    e.stopPropagation()
    e.currentTarget.setPointerCapture(e.pointerId)
    resizeState.current = { startX: e.clientX, startDuration: task.durationMinutes }
  }

  function handleResizePointerMove(e: React.PointerEvent) {
    if (!resizeState.current || !trackRef.current) return
    const containerWidth = trackRef.current.getBoundingClientRect().width
    const daySpan = toMinutes(dayEnd) - toMinutes(dayStart)
    const deltaPixels = e.clientX - resizeState.current.startX
    const deltaMinutes = (deltaPixels / containerWidth) * daySpan
    const rawDuration = resizeState.current.startDuration + deltaMinutes
    const snapped = Math.round(rawDuration / TIMELINE_SNAP_MINUTES) * TIMELINE_SNAP_MINUTES
    const clamped = Math.max(15, snapped)
    setLocalDuration(clamped)
  }

  function handleResizePointerUp() {
    if (!resizeState.current) return
    if (localDuration !== task.durationMinutes) {
      dispatch(updateTask({ ...task, durationMinutes: localDuration }))
    }
    resizeState.current = null
  }

  const dragStyle = {
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 30 : isHovered ? 25 : 10,
  }

  return (
    <div
      ref={setNodeRef}
      style={{
        left: `${clampedLeft}%`,
        width: `max(2rem, ${clampedWidth}%)`,
        ...dragStyle,
      }}
      className={[
        'absolute top-2 bottom-2 cursor-pointer select-none flex items-center shadow-[var(--shadow-task)]',
        isClippedLeft ? 'rounded-r-xl' : 'rounded-xl',
        colorMap[task.color],
        task.completed ? 'opacity-50' : '',
        isAnimating ? 'animate-[task-complete_0.4s_ease-out]' : '',
        isDragging ? 'opacity-80' : '',
      ].filter(Boolean).join(' ')}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => dispatch(setActiveTask(task.id))}
      {...listeners}
      {...attributes}
    >
      <span className={`px-2 text-xs font-medium text-stone-700 truncate flex-1 ${task.completed ? 'line-through' : ''}`}>
        {task.name}
      </span>
      {task.notes && (
        <span className="w-1.5 h-1.5 rounded-full bg-stone-500/40 shrink-0 mr-2" />
      )}
      {/* Resize handle */}
      <div
        className="w-4 absolute right-0 top-0 bottom-0 cursor-ew-resize touch-none rounded-r-xl"
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}
