export interface Todo {
	id: string
	text: string
	completed: boolean
	date: string
	priority: 'low' | 'medium' | 'high'
	dueTime?: string
	category?: string
	notes?: string
}
