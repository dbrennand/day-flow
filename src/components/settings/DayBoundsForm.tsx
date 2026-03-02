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
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-stone-500 uppercase tracking-wide">
            24-hour time
          </label>
          <button
            type="button"
            onClick={() => onSave({ ...settings, use24Hour: !settings.use24Hour })}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              settings.use24Hour ? 'bg-stone-700' : 'bg-cream-300'
            }`}
            aria-checked={settings.use24Hour}
            role="switch"
          >
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
              settings.use24Hour ? 'translate-x-4' : 'translate-x-1'
            }`} />
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-cream-200">
        <Button variant="danger" className="w-full" onClick={onClearDay}>
          Clear Day
        </Button>
      </div>
    </div>
  )
}
