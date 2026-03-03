import { useNow } from '../../hooks/useNow'
import { toMinutes } from '../../utils/time'

interface NowIndicatorProps {
  dayStart: string
  dayEnd: string
}

export function NowIndicator({ dayStart, dayEnd }: NowIndicatorProps) {
  const now = useNow()

  const dayStartMin = toMinutes(dayStart)
  const dayEndMin = toMinutes(dayEnd)
  const nowMin = toMinutes(now)
  const pct = ((nowMin - dayStartMin) / (dayEndMin - dayStartMin)) * 100

  if (pct < 0 || pct > 100) return null

  return (
    <div
      className="pointer-events-none absolute top-0 bottom-0 z-20 w-0.5 bg-stone-500/60"
      style={{ left: `${pct}%` }}
    >
      <div className="absolute -top-1 h-2 w-2 -translate-x-1/2 rounded-full bg-stone-500/70" />
    </div>
  )
}
