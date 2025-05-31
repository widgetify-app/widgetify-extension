export interface Todo {
  id: string
  text: string
  onlineId: string | null
  completed: boolean
  date: string
  priority: 'low' | 'medium' | 'high'
  category?: string
  notes?: string
}

export interface FetchedTodo {
  id: string
  text: string
  completed: boolean
  date: string
  priority: 'low' | 'medium' | 'high'
  category?: string
  description?: string
  offlineId?: string
  createdAt?: string
}
