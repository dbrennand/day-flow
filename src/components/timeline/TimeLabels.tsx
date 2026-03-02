import { toMinutes } from '../../utils/time'

interface TimeLabelsProps {
  dayStart: string
  dayEnd: string
}

function formatHourLabel(hour: number): string {
  if (hour === 0 || hour === 24) return '12a'
  if (hour === 12) return '12p'
  if (hour < 12) return `${hour}a`
  return `${hour - 12}p`
}

export function TimeLabels({ dayStart, dayEnd }: TimeLabelsProps) {
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
            {formatHourLabel(hour)}
          </span>
        )
      })}
    </div>
  )
}
