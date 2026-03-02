export type TaskColor = 'blue' | 'green' | 'yellow' | 'pink' | 'purple' | 'orange'

export interface Task {
  id: string
  name: string
  startTime: string        // "HH:MM"
  durationMinutes: number
  notes?: string
  completed: boolean
  color: TaskColor
}

export interface DaySettings {
  dayStartTime: string     // "HH:MM"
  dayEndTime: string       // "HH:MM"
  use24Hour: boolean
}

export interface AppState {
  tasks: Task[]
  settings: DaySettings
  isFocusMode: boolean
  activeTaskId: string | null
  isSettingsOpen: boolean
  isEndOfDay: boolean
}

export type AppAction =
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_COMPLETE'; payload: string }
  | { type: 'UPDATE_SETTINGS'; payload: DaySettings }
  | { type: 'CLEAR_DAY' }
  | { type: 'SET_FOCUS_MODE'; payload: boolean }
  | { type: 'SET_ACTIVE_TASK'; payload: string | null }
  | { type: 'SET_SETTINGS_OPEN'; payload: boolean }
  | { type: 'SET_END_OF_DAY'; payload: boolean }
