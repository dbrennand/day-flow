import { useRef } from 'react'
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
import { useNow } from '../../hooks/useNow'
import { TimelineBackground } from './TimelineBackground'
import { NowIndicator } from './NowIndicator'
import { TimeLabels } from './TimeLabels'
import { TaskBlock } from './TaskBlock'

export function Timeline() {
  const { state, dispatch } = useAppContext()
  const { tasks, settings, isFocusMode } = state
  const { dayStartTime, dayEndTime } = settings
  const now = useNow()
  const trackRef = useRef<HTMLDivElement>(null)

  const effectiveDayStart = isFocusMode ? now : dayStartTime
  const effectiveDayEnd = isFocusMode
    ? fromMinutes(Math.min(toMinutes(now) + 120, toMinutes(dayEndTime)))
    : dayEndTime

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
  )

  function handleDragEnd({ active, delta }: DragEndEvent) {
    const task = tasks.find(t => t.id === active.id)
    if (!task || !trackRef.current) return
    const containerWidth = trackRef.current.getBoundingClientRect().width
    const { left } = taskToTimelinePosition(task.startTime, task.durationMinutes, effectiveDayStart, effectiveDayEnd)
    const newPixelX = (left / 100) * containerWidth + delta.x
    const newStartTime = pixelToTime(newPixelX, containerWidth, effectiveDayStart, effectiveDayEnd)
    dispatch(updateTask({ ...task, startTime: newStartTime }))
  }

  return (
    <div className="px-6 pt-6 pb-4">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div
          ref={trackRef}
          className="relative h-24 w-full rounded-2xl overflow-hidden shadow-[var(--shadow-task)] select-none"
        >
          <TimelineBackground dayStart={effectiveDayStart} dayEnd={effectiveDayEnd} />
          {tasks.map(task => (
            <TaskBlock
              key={task.id}
              task={task}
              dayStart={effectiveDayStart}
              dayEnd={effectiveDayEnd}
              trackRef={trackRef}
            />
          ))}
          <NowIndicator dayStart={effectiveDayStart} dayEnd={effectiveDayEnd} />
        </div>
      </DndContext>
      <TimeLabels dayStart={effectiveDayStart} dayEnd={effectiveDayEnd} />
    </div>
  )
}
