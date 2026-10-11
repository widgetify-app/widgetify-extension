import { describe, expect, it } from 'bun:test'
import type { WidgetCategory } from '@/features/widgets/utils/layout-engine/types'
import {
	buildCatalogView,
	countByCategory,
	matchesQuery,
	normalizeSearchText,
	orderByFeatured,
} from '../catalog-filter'

interface Item {
	id: string
	title: string
	category?: WidgetCategory
}

const ITEMS: Item[] = [
	{ id: 'clock', title: 'ساعت', category: 'time' },
	{ id: 'todos', title: 'تسک‌ها', category: 'productivity' },
	{ id: 'notes', title: 'یادداشت', category: 'productivity' },
	{ id: 'weather', title: 'آب و هوا', category: 'info' },
	{ id: 'widget:pomodoro', title: 'پومودورو', category: 'productivity' },
	{ id: 'pet', title: 'پت', category: 'lifestyle' },
]

const titleOf = (item: Item) => item.title

const view = (overrides: Partial<Parameters<typeof buildCatalogView<Item>>[0]> = {}) =>
	buildCatalogView<Item>({
		items: ITEMS,
		category: 'all',
		query: '',
		featuredKeys: undefined,
		titleOf,
		isNew: (id) => id === 'widget:pomodoro',
		...overrides,
	})

const ids = (items: Item[]) => items.map((item) => item.id)

describe('normalizeSearchText', () => {
	it('unifies Arabic letters, digits and the half space', () => {
		expect(normalizeSearchText('  يادداشت ك ')).toBe('یادداشت ک')
		expect(normalizeSearchText('تسک‌ها')).toBe('تسک ها')
		expect(normalizeSearchText('٢۳4')).toBe('234')
		expect(normalizeSearchText('Pomo')).toBe('pomo')
	})

	it('drops harakat and tatweel', () => {
		expect(normalizeSearchText('سَاعـت')).toBe('ساعت')
	})
})

describe('matchesQuery', () => {
	it('matches every word in any order', () => {
		expect(matchesQuery('آب و هوا', 'هوا آب')).toBe(true)
		expect(matchesQuery('آب و هوا', 'آب ساعت')).toBe(false)
	})

	it('treats an empty query as a match', () => {
		expect(matchesQuery('ساعت', '   ')).toBe(true)
	})

	it('matches across the half space', () => {
		expect(matchesQuery('تسک‌ها', 'تسک ها')).toBe(true)
		expect(matchesQuery('تسک ها', 'تسک‌ها')).toBe(true)
	})
})

describe('orderByFeatured', () => {
	it('puts featured keys first in their own order and keeps the rest stable', () => {
		const ordered = orderByFeatured(ITEMS, ['pet', 'clock'])

		expect(ids(ordered)).toEqual([
			'pet',
			'clock',
			'todos',
			'notes',
			'weather',
			'widget:pomodoro',
		])
	})

	it('ignores an empty or missing list and does not mutate', () => {
		expect(orderByFeatured(ITEMS, undefined)).toBe(ITEMS)
		expect(orderByFeatured(ITEMS, [])).toBe(ITEMS)
		expect(ids(ITEMS)[0]).toBe('clock')
	})
})

describe('countByCategory', () => {
	it('counts each category and the total', () => {
		expect(countByCategory(ITEMS)).toEqual({
			all: 6,
			new: 0,
			time: 1,
			productivity: 3,
			info: 1,
			lifestyle: 1,
		})
	})

	it('counts an item without a category only in the total', () => {
		expect(countByCategory([{ id: 'x' }]).all).toBe(1)
	})
})

describe('buildCatalogView', () => {
	it('splits new widgets into their own strip on the all view', () => {
		const result = view()

		expect(ids(result.fresh)).toEqual(['widget:pomodoro'])
		expect(ids(result.rest)).toEqual(['clock', 'todos', 'notes', 'weather', 'pet'])
	})

	it('has no strip when nothing is new', () => {
		const result = view({ isNew: () => false })

		expect(result.fresh).toEqual([])
		expect(result.rest).toHaveLength(6)
	})

	it('filters by category without a strip', () => {
		const result = view({ category: 'productivity' })

		expect(result.fresh).toEqual([])
		expect(ids(result.rest)).toEqual(['todos', 'notes', 'widget:pomodoro'])
	})

	it('searches every category at once and ignores the chosen one', () => {
		const result = view({ category: 'time', query: 'پومو' })

		expect(result.fresh).toEqual([])
		expect(ids(result.rest)).toEqual(['widget:pomodoro'])
	})

	it('returns nothing when the search finds nothing', () => {
		const result = view({ query: 'zzz' })

		expect(result.fresh).toEqual([])
		expect(result.rest).toEqual([])
	})

	it('orders the strip and the rest by featured keys', () => {
		const result = view({
			featuredKeys: ['weather', 'clock'],
			isNew: (id) => id === 'weather' || id === 'widget:pomodoro',
		})

		expect(ids(result.fresh)).toEqual(['weather', 'widget:pomodoro'])
		expect(ids(result.rest)).toEqual(['clock', 'todos', 'notes', 'pet'])
	})
})
