/**
 * Shared types for all @waelio demo apps
 * Every framework implements these same interfaces
 */

export interface DemoScenario {
  id: string
  title: string
  description: string
  packages: string[]
  route: string
}

export interface CounterState {
  count: number
  history: number[]
}

export interface TodoItem {
  id: string
  text: string
  done: boolean
  createdAt: number
}

export interface Message {
  id: string
  channel: string
  payload: unknown
  timestamp: number
}

export interface StorageEntry {
  key: string
  value: string
  storage: 'local' | 'session' | 'cookie' | 'memory'
}
