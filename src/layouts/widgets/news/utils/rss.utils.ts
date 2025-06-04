import { GetRss } from '@/services/rss/rss.api'
import axios from 'axios'
import type { RssItem } from '../news.interface'

/**
 * Fetches and parses an RSS feed (supports RSS 2.0 and Atom)
 * @param url The URL of the RSS feed
 * @param sourceName The name of the feed source
 * @returns An array of parsed RSS items
 */
export const fetchRssFeed = async (
	url: string,
	sourceName: string,
): Promise<RssItem[]> => {
	try {
		const response = await GetRss(url)

		const text = response.data
		const parser = new DOMParser()
		const xmlDoc = parser.parseFromString(text, 'text/xml')

		if (xmlDoc.querySelector('parsererror')) {
			throw new Error('Failed to parse XML')
		}

		const isAtom = xmlDoc.querySelector('feed') !== null

		if (isAtom) {
			return parseAtomFeed(xmlDoc, sourceName, url)
		}

		return parseRssFeed(xmlDoc, sourceName, url)
	} catch (error) {
		console.error('Error fetching RSS feed:', error)
		return []
	}
}

/**
 * Parses an RSS 2.0 feed
 */
const parseRssFeed = (
	xmlDoc: Document,
	sourceName: string,
	sourceUrl: string,
): RssItem[] => {
	const items = xmlDoc.querySelectorAll('item')
	const rssItems: RssItem[] = []

	for (const item of Array.from(items)) {
		const title = item.querySelector('title')?.textContent || 'عنوان نامشخص'
		const link = item.querySelector('link')?.textContent || '#'
		const description = getCleanDescription(item)
		const pubDate =
			item.querySelector('pubDate')?.textContent ||
			item.querySelector('dc\\:date')?.textContent ||
			new Date().toISOString()

		rssItems.push({
			title,
			description,
			link,
			pubDate,
			source: {
				name: sourceName,
				url: sourceUrl,
			},
		})
	}

	return rssItems
}

/**
 * Parses an Atom feed
 */
const parseAtomFeed = (
	xmlDoc: Document,
	sourceName: string,
	sourceUrl: string,
): RssItem[] => {
	const entries = xmlDoc.querySelectorAll('entry')
	const rssItems: RssItem[] = []

	for (const entry of Array.from(entries)) {
		const title = entry.querySelector('title')?.textContent || 'عنوان نامشخص'

		const linkElement =
			entry.querySelector('link[rel="alternate"]') || entry.querySelector('link')
		const link = linkElement?.getAttribute('href') || '#'

		const contentElement =
			entry.querySelector('content') || entry.querySelector('summary')
		const description = contentElement?.textContent?.replace(/<[^>]*>?/gm, '') || ''

		// Atom uses updated or published
		const pubDate =
			entry.querySelector('published')?.textContent ||
			entry.querySelector('updated')?.textContent ||
			new Date().toISOString()

		rssItems.push({
			title,
			description,
			link,
			pubDate,
			source: {
				name: sourceName,
				url: sourceUrl,
			},
		})
	}

	return rssItems
}

/**
 * Gets a clean description from an RSS item
 * Handles different formats of description content
 */
const getCleanDescription = (item: Element): string => {
	// Try different elements that might contain the description
	const descriptionElement =
		item.querySelector('description') ||
		item.querySelector('content\\:encoded') ||
		item.querySelector('content')

	if (!descriptionElement) return ''

	let description = descriptionElement.textContent || ''

	// Remove HTML tags
	description = description.replace(/<[^>]*>?/gm, '')

	// Remove CDATA markers if present
	description = description.replace(/^\s*<!\[CDATA\[(.*)\]\]>\s*$/s, '$1')

	// Trim and limit length
	return description.trim().slice(0, 500)
}
