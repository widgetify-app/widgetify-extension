const SEEN_ACTIVITIES_KEPT = 200

export function unseenIds(currentIds: string[], seenIds: string[]): string[] {
	const seen = new Set(seenIds)
	return currentIds.filter((id) => !seen.has(id))
}

export function rememberSeen(
	seenIds: string[],
	currentIds: string[],
	cap = SEEN_ACTIVITIES_KEPT
): string[] {
	const current = new Set(currentIds)
	return [...seenIds.filter((id) => !current.has(id)), ...currentIds].slice(-cap)
}
