import { toMinutes } from '../../utils/time'

interface TimelineBackgroundProps {
  dayStart: string
  dayEnd: string
}

export function TimelineBackground({ dayStart, dayEnd }: TimelineBackgroundProps) {
  const dayStartMin = toMinutes(dayStart)
  const dayEndMin = toMinutes(dayEnd)
  const daySpan = dayEndMin - dayStartMin

  const noonMin = 12 * 60
  const eveningMin = 17 * 60

  const noonPct = Math.max(0, Math.min(100, ((noonMin - dayStartMin) / daySpan) * 100))
  const eveningPct = Math.max(0, Math.min(100, ((eveningMin - dayStartMin) / daySpan) * 100))

  const gradient = `linear-gradient(to right,
    #fff9ed 0%,
    #fef3d5 ${noonPct}%,
    #f0f7ff ${noonPct}%,
    #e0eeff ${eveningPct}%,
    #faf0ff ${eveningPct}%,
    #f3e0ff 100%
  )`

  return <div className="absolute inset-0 rounded-2xl" style={{ background: gradient }} />
}
