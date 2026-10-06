import { describe, expect, it } from 'bun:test'
import type { FetchedRssItem } from '@/services/news/get-news.hook'
import { mergeHeadlines } from '../utils/merge-headlines'

function headline(title: string, publishedAt: string, link = `https://x.ir/${title}`) {
	return {
		title,
		description: '',
		link,
		publishedAt,
		source: { name: 'x', url: 'https://x.ir' },
	} satisfies FetchedRssItem
}

describe('mergeHeadlines', () => {
	it('puts the headlines of every feed in one list, newest first', () => {
		const defaultFeed = [
			headline('a', '2026-10-04T11:00:00Z'),
			headline('b', '2026-10-04T08:00:00Z'),
		]
		const addedFeed = [headline('c', '2026-10-04T10:00:00Z')]

		expect(mergeHeadlines([defaultFeed, addedFeed]).map((h) => h.title)).toEqual([
			'a',
			'c',
			'b',
		])
	})

	it('shows a headline two feeds share once', () => {
		const shared = 'https://isna.ir/news/1'

		expect(
			mergeHeadlines([
				[headline('a', '2026-10-04T11:00:00Z', shared)],
				[headline('a again', '2026-10-04T11:00:00Z', shared)],
			])
		).toHaveLength(1)
	})

	it('keeps a headline without a readable date, at the end', () => {
		const merged = mergeHeadlines([
			[headline('undated', 'garbage'), headline('dated', '2026-10-04T09:00:00Z')],
		])

		expect(merged.map((h) => h.title)).toEqual(['dated', 'undated'])
	})
})
