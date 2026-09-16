import { SEARCH_HISTORY_LIMIT } from '../constants'

export interface SearchHistoryItem {
	query: string
	timestamp: number
}

export function normalizeSearchHistory(stored: unknown): SearchHistoryItem[] {
	if (!Array.isArray(stored)) return []

	const seen = new Set<string>()
	const normalized: SearchHistoryItem[] = []

	for (const entry of stored) {
		if (typeof entry?.query !== 'string') continue

		const query = entry.query.trim()
		if (!query || seen.has(query)) continue

		seen.add(query)
		normalized.push({
			query,
			timestamp: typeof entry.timestamp === 'number' ? entry.timestamp : 0,
		})

		if (normalized.length === SEARCH_HISTORY_LIMIT) break
	}

	return normalized
}
