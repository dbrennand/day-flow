import { useAppContext } from '../../store/AppContext'
import { updateSettings, clearDay, setSettingsOpen } from '../../store/actions'
import { DayBoundsForm } from './DayBoundsForm'

export function SettingsPanel() {
  const { state, dispatch } = useAppContext()
  const { isSettingsOpen, settings } = state

  function handleClose() {
    dispatch(setSettingsOpen(false))
  }

  return (
    <>
      {/* Backdrop */}
      {isSettingsOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/10 animate-[fade-in_0.2s_ease-out]"
          onClick={handleClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-40 w-80 bg-cream-50 shadow-[var(--shadow-panel)] transition-transform duration-300 ease-out flex flex-col ${
          isSettingsOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-stone-700">Settings</h2>
          <button
            onClick={handleClose}
            className="text-stone-400 hover:text-stone-600 transition-colors"
            aria-label="Close settings"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="3" x2="13" y2="13" />
              <line x1="13" y1="3" x2="3" y2="13" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-1 mb-4">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">Day bounds</p>
          </div>
          <DayBoundsForm
            settings={settings}
            onSave={s => dispatch(updateSettings(s))}
            onClearDay={() => {
              dispatch(clearDay())
              handleClose()
            }}
          />
        </div>
      </div>
    </>
  )
}
