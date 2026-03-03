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
    <div className="text-cream-50 flex items-center justify-between bg-stone-700 px-6 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
        </span>
        <span className="text-sm font-medium">Focus — next 2 hours</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-stone-300">{formatDisplayTime(now)}</span>
        <button
          onClick={() => dispatch(setFocusMode(false))}
          className="hover:text-cream-50 text-sm text-stone-300 underline underline-offset-2 transition-colors"
        >
          Exit focus
        </button>
      </div>
    </div>
  )
}
