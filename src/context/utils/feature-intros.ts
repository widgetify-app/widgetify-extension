const MAX_SEEN_INTROS = 200

export function normalizeSeenIntros(raw: unknown): string[] {
	if (!Array.isArray(raw)) return []
	const ids = raw.filter((id): id is string => typeof id === 'string' && id.length > 0)
	return [...new Set(ids)].slice(-MAX_SEEN_INTROS)
}

export function addSeenIntro(seen: string[], id: string): string[] {
	if (seen.includes(id)) return seen
	return normalizeSeenIntros([...seen, id])
}
