import { parse, format, addMinutes, differenceInMinutes } from 'date-fns'
import type { Task } from '../types'
import { TIMELINE_SNAP_MINUTES } from '../constants'

const BASE = new Date()

export function toMinutes(hhmm: string): number {
  const d = parse(hhmm, 'HH:mm', BASE)
  return d.getHours() * 60 + d.getMinutes()
}

export function fromMinutes(total: number): string {
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function nowHHMM(): string {
  return format(new Date(), 'HH:mm')
}

export function taskToTimelinePosition(
  startTime: string,
  durationMinutes: number,
  dayStart: string,
  dayEnd: string
): { left: number; width: number } {
  const dayStartMin = toMinutes(dayStart)
  const dayEndMin = toMinutes(dayEnd)
  const daySpan = dayEndMin - dayStartMin

  const taskStart = toMinutes(startTime)
  const left = ((taskStart - dayStartMin) / daySpan) * 100
  const width = (durationMinutes / daySpan) * 100

  return { left, width }
}

export function nowToTimelinePercent(dayStart: string, dayEnd: string): number {
  const dayStartMin = toMinutes(dayStart)
  const dayEndMin = toMinutes(dayEnd)
  const daySpan = dayEndMin - dayStartMin
  const nowMin = toMinutes(nowHHMM())
  return ((nowMin - dayStartMin) / daySpan) * 100
}

export function pixelToTime(
  pixelX: number,
  containerWidth: number,
  dayStart: string,
  dayEnd: string,
  snap: number = TIMELINE_SNAP_MINUTES
): string {
  const dayStartMin = toMinutes(dayStart)
  const dayEndMin = toMinutes(dayEnd)
  const daySpan = dayEndMin - dayStartMin

  const rawMinutes = (pixelX / containerWidth) * daySpan + dayStartMin
  const snapped = Math.round(rawMinutes / snap) * snap
  const clamped = Math.max(dayStartMin, Math.min(dayEndMin, snapped))

  return fromMinutes(clamped)
}

export function formatDisplayTime(hhmm: string, use24Hour = false): string {
  const d = parse(hhmm, 'HH:mm', BASE)
  return use24Hour ? format(d, 'HH:mm') : format(d, 'h:mm a')
}

export function getTimeOfDay(hhmm: string): 'morning' | 'midday' | 'evening' {
  const minutes = toMinutes(hhmm)
  if (minutes < 12 * 60) return 'morning'
  if (minutes < 17 * 60) return 'midday'
  return 'evening'
}

export function isOverloaded(
  tasks: Task[],
  dayStart: string,
  dayEnd: string,
  threshold: number
): boolean {
  const daySpan = toMinutes(dayEnd) - toMinutes(dayStart)

  const totalBooked = tasks.reduce((acc, task) => {
    const taskStart = parse(task.startTime, 'HH:mm', BASE)
    const taskEnd = addMinutes(taskStart, task.durationMinutes)
    const overlap = differenceInMinutes(taskEnd, taskStart)
    return acc + overlap
  }, 0)

  return totalBooked / daySpan > threshold
}
