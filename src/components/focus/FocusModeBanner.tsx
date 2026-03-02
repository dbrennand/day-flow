import { useAppContext } from '../../store/AppContext'
import { setFocusMode } from '../../store/actions'
import { useNow } from '../../hooks/useNow'
import { formatDisplayTime } from '../../utils/time'

export function FocusModeBanner() {
  const { state, dispatch } = useAppContext()
  const { isFocusMode } = state
  const now = useNow()

  if (!isFocusMode) return null

  return (
    <div className="bg-stone-700 text-cream-50 px-6 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400" />
        </span>
        <span className="text-sm font-medium">Focus — next 2 hours</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-stone-300">{formatDisplayTime(now)}</span>
        <button
          onClick={() => dispatch(setFocusMode(false))}
          className="text-sm text-stone-300 hover:text-cream-50 transition-colors underline underline-offset-2"
        >
          Exit focus
        </button>
      </div>
    </div>
  )
}
