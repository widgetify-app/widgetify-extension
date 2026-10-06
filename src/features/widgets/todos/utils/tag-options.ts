export function cleanTags(tags: string[] | undefined): string[] {
	const seen = new Set<string>()
	for (const tag of tags ?? []) {
		const trimmed = tag.trim()
		if (trimmed) seen.add(trimmed)
	}
	return [...seen]
}

export function matchTags(tags: string[], query: string): string[] {
	const needle = query.trim().toLowerCase()
	if (!needle) return tags
	return tags.filter((tag) => tag.toLowerCase().includes(needle))
}

export function newTagName(tags: string[], query: string): string | null {
	const name = query.trim()
	if (!name) return null
	const exists = tags.some((tag) => tag.toLowerCase() === name.toLowerCase())
	return exists ? null : name
}
