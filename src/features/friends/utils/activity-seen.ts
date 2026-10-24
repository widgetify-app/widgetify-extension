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

type ReactionCaption =
	| { kind: 'count'; count: number }
	| { kind: 'one'; name: string }
	| { kind: 'many'; name: string; others: number }

export function reactionCaption(
	count: number,
	firstName: string | undefined
): ReactionCaption | null {
	if (count <= 0) return null
	if (!firstName) return { kind: 'count', count }
	if (count === 1) return { kind: 'one', name: firstName }

	return { kind: 'many', name: firstName, others: count - 1 }
}
