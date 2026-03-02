import type { AppState, AppAction } from '../types'

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] }

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(t => (t.id === action.payload.id ? action.payload : t)),
      }

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(t => t.id !== action.payload),
        activeTaskId: state.activeTaskId === action.payload ? null : state.activeTaskId,
      }

    case 'TOGGLE_COMPLETE':
      return {
        ...state,
        tasks: state.tasks.map(t =>
          t.id === action.payload ? { ...t, completed: !t.completed } : t,
        ),
      }

    case 'UPDATE_SETTINGS':
      return { ...state, settings: action.payload }

    case 'CLEAR_DAY':
      return { ...state, tasks: [], activeTaskId: null, isEndOfDay: false }

    case 'SET_FOCUS_MODE':
      return { ...state, isFocusMode: action.payload }

    case 'SET_ACTIVE_TASK':
      return { ...state, activeTaskId: action.payload }

    case 'SET_SETTINGS_OPEN':
      return { ...state, isSettingsOpen: action.payload }

    case 'SET_END_OF_DAY':
      return { ...state, isEndOfDay: action.payload }

    default:
      return state
  }
}
