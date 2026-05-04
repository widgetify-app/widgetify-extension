export enum TodoPriority {
	Low = 'low',
	Medium = 'medium',
	High = 'high',
}
export interface Todo {
	id: string
	text: string
	completed: boolean
	date: string
	priority: TodoPriority
	category: string
	offlineId: string | null
	description: string
	order: number
	createdAt?: string
	updatedAt?: string
	friends: {
		avatar: string
		completed: boolean
		name: string
		isSelf: boolean
	}[]
	owner: {
		name: string
		avatar: string
		isSelf: boolean
	}
}

export interface FetchedTodo extends Todo {}

export interface AddTodoInput {
	text: string
	date: string
	priority?: TodoPriority
	category?: string
	description?: string
	friendIds?: string[]
}

export interface UpdateTodoInput {
	id: string
	text?: string
	completed?: boolean
	date?: string
	priority?: TodoPriority
	category?: string
	description?: string
	friendIds?: string[]
}

export interface ReorderTodoInput {
	id: string
	order: number
}

export enum TodoViewType {
	Day = 'day',
	Monthly = 'monthly',
	All = 'all',
}

export interface TodoOptions {
	viewMode: TodoViewType
}

export interface TodoFilter {
	type: 'active' | 'completed' | 'all'
}

export interface TodoStats {
	totalTodos: number
	completedTodos: number
	completionRate: number
	priorityStats: {
		high: number
		medium: number
		low: number
	}
	topCategories: Array<[string, number]>
}
