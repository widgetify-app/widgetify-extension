interface SharedTask {
	completed: boolean
	owner?: { isSelf?: boolean } | null
	friends?: { isSelf?: boolean; completed?: boolean }[] | null
}

export function resolveIsDone(todo: SharedTask): boolean {
	if (todo.owner?.isSelf) return todo.completed

	return todo.friends?.find((f) => f.isSelf)?.completed ?? todo.completed
}
