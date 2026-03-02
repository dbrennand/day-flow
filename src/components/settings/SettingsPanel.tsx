import { useAppContext } from '../../store/AppContext'
import { updateSettings, clearDay, setSettingsOpen } from '../../store/actions'
import { Modal } from '../ui/Modal'
import { DayBoundsForm } from './DayBoundsForm'

export function SettingsPanel() {
  const { state, dispatch } = useAppContext()
  const { settings } = state

  if (!state.isSettingsOpen) return null

  function handleClose() {
    dispatch(setSettingsOpen(false))
  }

  return (
    <Modal onClose={handleClose}>
      {/* Header */}
      <div className="border-cream-200 mb-6 flex items-center justify-between border-b pb-4">
        <h2 className="text-sm font-semibold text-stone-700">Settings</h2>
        <button
          onClick={handleClose}
          className="text-stone-400 transition-colors hover:text-stone-600"
          aria-label="Close settings"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <line x1="3" y1="3" x2="13" y2="13" />
            <line x1="13" y1="3" x2="3" y2="13" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="overflow-y-auto">
        <div className="mb-4 space-y-1">
          <p className="text-xs font-medium tracking-wide text-stone-500 uppercase">Day bounds</p>
        </div>
        <DayBoundsForm
          settings={settings}
          onSave={(s) => dispatch(updateSettings(s))}
          onClearDay={() => {
            dispatch(clearDay())
            handleClose()
          }}
        />
      </div>
    </Modal>
  )
}
