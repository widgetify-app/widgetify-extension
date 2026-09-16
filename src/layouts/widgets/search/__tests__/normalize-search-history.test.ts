import { describe, expect, it } from 'bun:test'
import { SEARCH_HISTORY_LIMIT } from '../constants'
import { normalizeSearchHistory } from '../utils/normalize-search-history'

describe('normalizeSearchHistory', () => {
	it('returns an empty list for anything that is not an array', () => {
		expect(normalizeSearchHistory(null)).toEqual([])
		expect(normalizeSearchHistory(undefined)).toEqual([])
		expect(normalizeSearchHistory('recent')).toEqual([])
		expect(normalizeSearchHistory({ query: 'hi' })).toEqual([])
	})

	it('drops entries without a usable query', () => {
		const result = normalizeSearchHistory([
			{ query: 'ویجتیفای', timestamp: 1 },
			{ query: '   ', timestamp: 2 },
			{ query: 42, timestamp: 3 },
			null,
			{ timestamp: 4 },
		])

		expect(result).toEqual([{ query: 'ویجتیفای', timestamp: 1 }])
	})

	it('trims queries and removes duplicates, keeping the newest first', () => {
		const result = normalizeSearchHistory([
			{ query: ' react ', timestamp: 20 },
			{ query: 'react', timestamp: 10 },
		])

		expect(result).toEqual([{ query: 'react', timestamp: 20 }])
	})

	it('defaults a missing timestamp instead of storing NaN', () => {
		const result = normalizeSearchHistory([{ query: 'bun' }])

		expect(result).toEqual([{ query: 'bun', timestamp: 0 }])
	})

	it('never returns more than the history limit', () => {
		const stored = Array.from({ length: SEARCH_HISTORY_LIMIT + 5 }, (_, i) => ({
			query: `query-${i}`,
			timestamp: i,
		}))

		expect(normalizeSearchHistory(stored)).toHaveLength(SEARCH_HISTORY_LIMIT)
	})
})
