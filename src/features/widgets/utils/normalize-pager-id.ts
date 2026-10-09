export function normalizePagerId(value: unknown): string | null {
	if (typeof value !== 'string') return null
	const id = value.trim()
	return id.length > 0 ? id : null
}

export function isPagerIdStale(
	currentId: string | null,
	ids: readonly string[],
	isReady: boolean
): boolean {
	return isReady && currentId !== null && !ids.includes(currentId)
}
