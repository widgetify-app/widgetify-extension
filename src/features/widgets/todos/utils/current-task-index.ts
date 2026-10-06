interface TaskLike {
	id: string
	completed: boolean
}

export function currentTaskIndex(tasks: TaskLike[], currentId: string | null): number {
	const chosen = currentId ? tasks.findIndex((task) => task.id === currentId) : -1
	if (chosen !== -1) return chosen

	const firstOpen = tasks.findIndex((task) => !task.completed)
	return firstOpen === -1 ? 0 : firstOpen
}

export function nextOpenTaskId(tasks: TaskLike[], fromIndex: number): string | null {
	const after = tasks.slice(fromIndex + 1).find((task) => !task.completed)
	const before = tasks.slice(0, fromIndex).find((task) => !task.completed)
	return (after ?? before)?.id ?? null
}
