import { toMinutes } from '../../utils/time'

interface TimeLabelsProps {
  dayStart: string
  dayEnd: string
  use24Hour?: boolean
}

function formatHourLabel(hour: number, use24Hour: boolean): string {
  if (use24Hour) return `${String(hour % 24).padStart(2, '0')}:00`
  if (hour === 0 || hour === 24) return '12am'
  if (hour === 12) return '12pm'
  return hour < 12 ? `${hour}am` : `${hour - 12}pm`
}

export function TimeLabels({ dayStart, dayEnd, use24Hour = false }: TimeLabelsProps) {
  const dayStartMin = toMinutes(dayStart)
  const dayEndMin = toMinutes(dayEnd)
  const daySpan = dayEndMin - dayStartMin

  const firstHour = Math.ceil(dayStartMin / 60)
  const lastHour = Math.floor(dayEndMin / 60)

  const ticks: number[] = []
  for (let h = firstHour; h <= lastHour; h++) {
    ticks.push(h)
  }

  return (
    <div className="relative w-full h-6 mt-1">
      {ticks.map(hour => {
        const pct = ((hour * 60 - dayStartMin) / daySpan) * 100
        if (pct < 0 || pct > 100) return null
        return (
          <span
            key={hour}
            className="absolute -translate-x-1/2 text-xs text-stone-400 select-none"
            style={{ left: `${pct}%` }}
          >
            {formatHourLabel(hour, use24Hour)}
          </span>
        )
      })}
    </div>
  )
}
