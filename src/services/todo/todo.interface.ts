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
