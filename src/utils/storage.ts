import type { AppState } from '../types'
import { DEFAULT_DAY_START, DEFAULT_DAY_END } from '../constants'

const STORAGE_KEY = 'dayflow_state'

export function loadState(defaultState: AppState): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    return {
      ...defaultState,
      tasks: parsed.tasks ?? defaultState.tasks,
      settings: parsed.settings ?? defaultState.settings,
    }
  } catch {
    return defaultState
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ tasks: state.tasks, settings: state.settings })
    )
  } catch {
    // quota exceeded or private mode — silently ignore
  }
}

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export const DEFAULT_STATE: AppState = {
  tasks: [],
  settings: {
    dayStartTime: DEFAULT_DAY_START,
    dayEndTime: DEFAULT_DAY_END,
    use24Hour: false,
  },
  isFocusMode: false,
  activeTaskId: null,
  isSettingsOpen: false,
  isEndOfDay: false,
}
