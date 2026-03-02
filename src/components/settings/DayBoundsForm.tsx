import { useState } from 'react'
import type { DaySettings } from '../../types'
import { Button } from '../ui/Button'

interface DayBoundsFormProps {
  settings: DaySettings
  onSave: (settings: DaySettings) => void
  onClearDay: () => void
}

export function DayBoundsForm({ settings, onSave, onClearDay }: DayBoundsFormProps) {
  const [error, setError] = useState<string | null>(null)

  function handleChange(field: keyof DaySettings, value: string) {
    const next = { ...settings, [field]: value }
    if (next.dayStartTime >= next.dayEndTime) {
      setError('Start time must be before end time')
      return
    }
    setError(null)
    onSave(next)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">
            Day starts
          </label>
          <input
            type="time"
            value={settings.dayStartTime}
            onChange={e => handleChange('dayStartTime', e.target.value)}
            className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">
            Day ends
          </label>
          <input
            type="time"
            value={settings.dayEndTime}
            onChange={e => handleChange('dayEndTime', e.target.value)}
            className="w-full rounded-lg border border-cream-300 bg-cream-50 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
        </div>
        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>

      <div className="pt-2 border-t border-cream-200">
        <Button variant="danger" className="w-full" onClick={onClearDay}>
          Clear Day
        </Button>
      </div>
    </div>
  )
}
