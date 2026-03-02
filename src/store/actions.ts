import type { Task, DaySettings, AppAction } from '../types'

export const addTask = (payload: Task): AppAction => ({ type: 'ADD_TASK', payload })
export const updateTask = (payload: Task): AppAction => ({ type: 'UPDATE_TASK', payload })
export const deleteTask = (id: string): AppAction => ({ type: 'DELETE_TASK', payload: id })
export const toggleComplete = (id: string): AppAction => ({ type: 'TOGGLE_COMPLETE', payload: id })
export const updateSettings = (payload: DaySettings): AppAction => ({ type: 'UPDATE_SETTINGS', payload })
export const clearDay = (): AppAction => ({ type: 'CLEAR_DAY' })
export const setFocusMode = (payload: boolean): AppAction => ({ type: 'SET_FOCUS_MODE', payload })
export const setActiveTask = (payload: string | null): AppAction => ({ type: 'SET_ACTIVE_TASK', payload })
export const setSettingsOpen = (payload: boolean): AppAction => ({ type: 'SET_SETTINGS_OPEN', payload })
export const setEndOfDay = (payload: boolean): AppAction => ({ type: 'SET_END_OF_DAY', payload })
