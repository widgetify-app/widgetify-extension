import type { FetchedRssItem } from '@/services/news/get-news.hook'

export function headlineKey(item: FetchedRssItem): string {
	return item.link || `${item.source?.name}-${item.publishedAt}-${item.title}`
}

export function mergeHeadlines(feeds: FetchedRssItem[][]): FetchedRssItem[] {
	const seen = new Set<string>()
	const merged: FetchedRssItem[] = []

	for (const items of feeds) {
		for (const item of items) {
			const key = headlineKey(item)
			if (seen.has(key)) continue
			seen.add(key)
			merged.push(item)
		}
	}

	return merged.sort((a, b) => publishedTime(b) - publishedTime(a))
}

function publishedTime(item: FetchedRssItem): number {
	const time = new Date(item.publishedAt).getTime()
	return Number.isFinite(time) ? time : 0
}
