import type { WidgetCategory } from '@/features/widgets/utils/layout-engine/types'

interface CatalogFilterItem {
	id: string
	category?: WidgetCategory
}

export interface CatalogView<T> {
	fresh: T[]
	rest: T[]
}

interface CatalogViewInput<T> {
	items: T[]
	category: WidgetCategory
	query: string
	featuredKeys: string[] | undefined
	titleOf: (item: T) => string
	isNew: (id: string) => boolean
}

const PERSIAN_ZERO = 0x06f0
const ARABIC_ZERO = 0x0660
const ARABIC_YEH = String.fromCharCode(0x064a)
const ARABIC_KAF = String.fromCharCode(0x0643)
const PERSIAN_YEH = String.fromCharCode(0x06cc)
const PERSIAN_KEH = String.fromCharCode(0x06a9)
const PERSIAN_DIGITS = /[\u06F0-\u06F9]/g
const ARABIC_DIGITS = /[\u0660-\u0669]/g
const COMBINING_MARKS = /[\u064B-\u065F\u0670\u0640]/g
const SEPARATORS = /[\u200C\u200E\u200Fs]+/g

export function normalizeSearchText(text: string): string {
	return text
		.replaceAll(ARABIC_YEH, PERSIAN_YEH)
		.replaceAll(ARABIC_KAF, PERSIAN_KEH)
		.replace(PERSIAN_DIGITS, (digit) => String(digit.charCodeAt(0) - PERSIAN_ZERO))
		.replace(ARABIC_DIGITS, (digit) => String(digit.charCodeAt(0) - ARABIC_ZERO))
		.replace(COMBINING_MARKS, '')
		.toLowerCase()
		.replace(SEPARATORS, ' ')
		.trim()
}

export function matchesQuery(title: string, query: string): boolean {
	const words = normalizeSearchText(query).split(' ').filter(Boolean)

	if (words.length === 0) return true

	const haystack = normalizeSearchText(title)

	return words.every((word) => haystack.includes(word))
}

export function orderByFeatured<T extends CatalogFilterItem>(
	items: T[],
	featuredKeys: string[] | undefined
): T[] {
	if (!featuredKeys || featuredKeys.length === 0) return items

	const rank = new Map(featuredKeys.map((key, index) => [key, index]))

	return [...items].sort((a, b) => {
		const first = rank.get(a.id)
		const second = rank.get(b.id)

		if (first !== undefined && second !== undefined) return first - second
		if (first !== undefined) return -1
		if (second !== undefined) return 1

		return 0
	})
}

export function countByCategory<T extends CatalogFilterItem>(
	items: T[]
): Record<WidgetCategory, number> {
	const counts: Record<WidgetCategory, number> = {
		all: items.length,
		new: 0,
		time: 0,
		productivity: 0,
		info: 0,
		lifestyle: 0,
	}

	for (const item of items) {
		if (item.category) counts[item.category] += 1
	}

	return counts
}

export function buildCatalogView<T extends CatalogFilterItem>({
	items,
	category,
	query,
	featuredKeys,
	titleOf,
	isNew,
}: CatalogViewInput<T>): CatalogView<T> {
	const isSearching = normalizeSearchText(query).length > 0

	const matching = items.filter((item) => {
		if (isSearching) return matchesQuery(titleOf(item), query)

		return category === 'all' || item.category === category
	})

	const ordered = orderByFeatured(matching, featuredKeys)

	if (isSearching || category !== 'all') return { fresh: [], rest: ordered }

	return {
		fresh: ordered.filter((item) => isNew(item.id)),
		rest: ordered.filter((item) => !isNew(item.id)),
	}
}
