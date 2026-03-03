import { useRef, useState } from 'react'
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useAppContext } from '../../store/AppContext'
import { updateTask } from '../../store/actions'
import { toMinutes, fromMinutes, taskToTimelinePosition, pixelToTime } from '../../utils/time'
import { TIMELINE_SNAP_MINUTES } from '../../constants'
import { useNow } from '../../hooks/useNow'
import { TimelineBackground } from './TimelineBackground'
import { NowIndicator } from './NowIndicator'
import { TimeLabels } from './TimeLabels'
import { TaskBlock } from './TaskBlock'
import { CreateTaskModal } from '../tasks/CreateTaskModal'

type DragCreate = { anchorX: number; currentX: number; containerWidth: number }

export function Timeline() {
  const { state, dispatch } = useAppContext()
  const { tasks, settings, isFocusMode } = state
  const { dayStartTime, dayEndTime, use24Hour } = settings
  const now = useNow()
  const trackRef = useRef<HTMLDivElement>(null)

  const [dragCreate, setDragCreate] = useState<DragCreate | null>(null)
  const [pendingCreate, setPendingCreate] = useState<{
    startTime: string
    durationMinutes: number
  } | null>(null)

  const effectiveDayStart = isFocusMode ? now : dayStartTime
  const effectiveDayEnd = isFocusMode
    ? fromMinutes(Math.min(toMinutes(now) + 120, toMinutes(dayEndTime)))
    : dayEndTime

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  function handleDragEnd({ active, delta }: DragEndEvent) {
    const task = tasks.find((t) => t.id === active.id)
    if (!task || !trackRef.current) return
    const containerWidth = trackRef.current.getBoundingClientRect().width
    const { left } = taskToTimelinePosition(
      task.startTime,
      task.durationMinutes,
      effectiveDayStart,
      effectiveDayEnd
    )
    const newPixelX = (left / 100) * containerWidth + delta.x
    const newStartTime = pixelToTime(newPixelX, containerWidth, effectiveDayStart, effectiveDayEnd)
    dispatch(updateTask({ ...task, startTime: newStartTime }))
  }

  function handleTrackPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).closest('[data-task-id]')) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragCreate({ anchorX: x, currentX: x, containerWidth: rect.width })
  }

  function handleTrackPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragCreate) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    setDragCreate((prev) => (prev ? { ...prev, currentX: x } : null))
  }

  function handleTrackPointerUp() {
    if (!dragCreate) return
    const { anchorX, currentX, containerWidth } = dragCreate
    const startTime = pixelToTime(
      Math.min(anchorX, currentX),
      containerWidth,
      effectiveDayStart,
      effectiveDayEnd
    )
    const endTime = pixelToTime(
      Math.max(anchorX, currentX),
      containerWidth,
      effectiveDayStart,
      effectiveDayEnd
    )
    const durationMinutes = toMinutes(endTime) - toMinutes(startTime)
    if (durationMinutes >= TIMELINE_SNAP_MINUTES) {
      setPendingCreate({ startTime, durationMinutes })
    }
    setDragCreate(null)
  }

  const showGhost = dragCreate !== null && Math.abs(dragCreate.currentX - dragCreate.anchorX) > 4
  let ghostLeft = 0
  let ghostWidth = 0
  let ghostDuration = 0
  if (showGhost && dragCreate) {
    const { anchorX, currentX, containerWidth } = dragCreate
    const ghostStartTime = pixelToTime(
      Math.min(anchorX, currentX),
      containerWidth,
      effectiveDayStart,
      effectiveDayEnd
    )
    const ghostEndTime = pixelToTime(
      Math.max(anchorX, currentX),
      containerWidth,
      effectiveDayStart,
      effectiveDayEnd
    )
    ghostDuration = Math.max(
      TIMELINE_SNAP_MINUTES,
      toMinutes(ghostEndTime) - toMinutes(ghostStartTime)
    )
    const pos = taskToTimelinePosition(
      ghostStartTime,
      ghostDuration,
      effectiveDayStart,
      effectiveDayEnd
    )
    ghostLeft = pos.left
    ghostWidth = pos.width
  }

  return (
    <div className="px-6 pt-6 pb-4">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div
          ref={trackRef}
          className={[
            'relative h-24 w-full overflow-hidden rounded-2xl shadow-[var(--shadow-task)] select-none',
            dragCreate ? 'cursor-crosshair' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onPointerDown={handleTrackPointerDown}
          onPointerMove={handleTrackPointerMove}
          onPointerUp={handleTrackPointerUp}
          onPointerCancel={() => setDragCreate(null)}
        >
          <TimelineBackground dayStart={effectiveDayStart} dayEnd={effectiveDayEnd} />
          {tasks.map((task) => (
            <TaskBlock
              key={task.id}
              task={task}
              dayStart={effectiveDayStart}
              dayEnd={effectiveDayEnd}
              trackRef={trackRef}
            />
          ))}
          <NowIndicator dayStart={effectiveDayStart} dayEnd={effectiveDayEnd} />
          {showGhost && (
            <div
              style={{ left: `${ghostLeft}%`, width: `${ghostWidth}%` }}
              className="pointer-events-none absolute inset-y-2 flex items-center justify-center rounded-xl border-2 border-dashed border-stone-500/30 bg-stone-900/10"
            >
              <span className="text-xs font-medium text-stone-600">{ghostDuration} min</span>
            </div>
          )}
        </div>
      </DndContext>
      <TimeLabels dayStart={effectiveDayStart} dayEnd={effectiveDayEnd} use24Hour={use24Hour} />
      {pendingCreate && (
        <CreateTaskModal
          startTime={pendingCreate.startTime}
          durationMinutes={pendingCreate.durationMinutes}
          onClose={() => setPendingCreate(null)}
        />
      )}
    </div>
  )
}
