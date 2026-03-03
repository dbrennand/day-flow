import { useAppContext } from '../store/AppContext'
import { taskToTimelinePosition, nowToTimelinePercent, pixelToTime } from '../utils/time'
import type { Task } from '../types'

export function useTimelineUtils() {
  const { state } = useAppContext()
  const { dayStartTime, dayEndTime } = state.settings

  return {
    getTaskPosition: (task: Task) =>
      taskToTimelinePosition(task.startTime, task.durationMinutes, dayStartTime, dayEndTime),

    getNowPercent: () => nowToTimelinePercent(dayStartTime, dayEndTime),

    pixelToTime: (pixelX: number, containerWidth: number, snap?: number) =>
      pixelToTime(pixelX, containerWidth, dayStartTime, dayEndTime, snap),
  }
}
