import type { Todo } from '@/services/hooks/todo/todo.interface'

const PRIORITY_RANK: Record<string, number> = {
	high: 3,
	medium: 2,
	low: 1,
}

function rank(priority?: string): number {
	return PRIORITY_RANK[priority ?? ''] ?? 0
}

export function sortTodos<T extends Todo>(todos: T[], sort: string): T[] {
	const byOrder = (a: T, b: T) => a.order - b.order

	if (sort === 'high' || sort === 'medium' || sort === 'low') {
		const target = rank(sort)

		return [...todos].sort((a, b) => {
			const aMatches = rank(a.priority) === target
			const bMatches = rank(b.priority) === target
			if (aMatches !== bMatches) return aMatches ? -1 : 1
			return byOrder(a, b)
		})
	}

	return [...todos].sort(byOrder)
}
