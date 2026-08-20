import { describe, expect, it } from 'bun:test'
import type { Bookmark } from '../types/bookmark.types'
import type { FetchedBookmark } from '@/services/hooks/bookmark/get-bookmarks.hook'
import type { WidgetSize } from '../../widgets/layout-engine/types'

function mapBookmarks(fetchedBookmarks: FetchedBookmark[]): Bookmark[] {
	return fetchedBookmarks.map((bookmark) => ({
		id: bookmark.offlineId || bookmark.id,
		title: bookmark.title,
		type: bookmark.type,
		parentId: bookmark.parentId,
		isLocal: true,
		isManageable: bookmark.isManageable,
		url: bookmark.url,
		icon: bookmark.icon,
		onlineId: bookmark.id,
		sticker: bookmark.sticker ?? null,
		customTextColor: bookmark.customTextColor ?? null,
		customBackground: bookmark.customBackground ?? null,
		order: bookmark.order || 0,
		widgetId: bookmark.widgetId || null,
	}))
}

function getFolderItems(
	bookmarks: Bookmark[] | null,
	parentId: string | null
): Bookmark[] {
	if (!bookmarks) return []
	const parentBookmark = bookmarks.find(
		(b) => b.id === parentId || b.onlineId === parentId
	)

	let currentFolderBookmarks: Bookmark[] = []
	if (parentId) {
		currentFolderBookmarks = bookmarks.filter(
			(bookmark) =>
				(typeof bookmark.parentId === 'string' &&
					bookmark.parentId === parentId) ||
				(typeof bookmark.parentId === 'string' &&
					parentBookmark?.id &&
					bookmark.parentId === parentBookmark.id) ||
				(typeof bookmark.parentId === 'string' &&
					parentBookmark?.onlineId &&
					bookmark.parentId === parentBookmark.onlineId)
		)
	} else {
		currentFolderBookmarks = bookmarks.filter(
			(bookmark) => bookmark.parentId === null
		)
	}

	return [...currentFolderBookmarks].sort((a, b) => {
		return (a.order || 0) - (b.order || 0)
	})
}

function computeBookmarkGridDimensions(size?: WidgetSize): {
	colsCount: number
	rowsCount: number
	totalBookmarks: number
} {
	let colsCount = 5
	let rowsCount = 2

	if (size) {
		if (size.w === 1 && size.h === 1) {
			colsCount = 1
			rowsCount = 1
		} else if (size.w === 1) {
			colsCount = 1
			rowsCount = size.h
		} else if (size.w === 2 && size.h === 1) {
			colsCount = 2
			rowsCount = 1
		} else if (size.w === 2 && size.h === 2) {
			colsCount = 2
			rowsCount = 2
		} else if (size.w === 2 && size.h >= 3) {
			colsCount = 2
			rowsCount = 5
		} else if (size.w === 2) {
			colsCount = 2
			rowsCount = size.h
		} else if (size.w === 4 && size.h === 1) {
			colsCount = 5
			rowsCount = 1
		} else if (size.w === 4) {
			colsCount = 5
			rowsCount = size.h
		}
	}

	return {
		colsCount,
		rowsCount,
		totalBookmarks: colsCount * rowsCount,
	}
}

function mergeBookmarksWithEmptySlots(
	bookmarks: Bookmark[],
	totalSlots: number
): (Bookmark | null)[] {
	const filled: (Bookmark | null)[] = [...bookmarks.slice(0, totalSlots)]
	while (filled.length < totalSlots) {
		filled.push(null)
	}
	return filled
}

describe('Bookmark Legacy Compatibility & Layout Tests', () => {
	it('maps legacy bookmarks with offlineId correctly', () => {
		const legacyFetched: FetchedBookmark[] = [
			{
				id: 'server-id-123',
				offlineId: 'local-uuid-456',
				title: 'گوگل',
				url: 'https://google.com',
				icon: 'https://google.com/favicon.ico',
				isManageable: true,
				type: 'BOOKMARK',
				parentId: '',
				iconIsS3Hosted: false,
				children: [],
				order: 0,
			},
			{
				id: 'server-id-789',
				offlineId: null,
				title: 'گیت‌هاب',
				url: 'https://github.com',
				icon: 'https://github.com/favicon.ico',
				isManageable: true,
				type: 'BOOKMARK',
				parentId: '',
				iconIsS3Hosted: false,
				children: [],
				order: 1,
			},
		]

		const mapped = mapBookmarks(legacyFetched)

		expect(mapped).toHaveLength(2)
		expect(mapped[0].id).toBe('local-uuid-456')
		expect(mapped[0].onlineId).toBe('server-id-123')
		expect(mapped[1].id).toBe('server-id-789')
		expect(mapped[1].onlineId).toBe('server-id-789')
	})

	it('safely handles legacy bookmarks with missing optional fields without crashing', () => {
		const rawLegacyData: any[] = [
			{
				id: 'legacy-1',
				title: 'سایت قدیمی',
				type: 'BOOKMARK',
				url: 'https://example.com',
				icon: null,
				isManageable: true,
				parentId: null,
				iconIsS3Hosted: false,
				children: [],
			},
		]

		const mapped = mapBookmarks(rawLegacyData)
		expect(mapped[0].sticker).toBeNull()
		expect(mapped[0].customTextColor).toBeNull()
		expect(mapped[0].customBackground).toBeNull()
		expect(mapped[0].order).toBe(0)
		expect(mapped[0].widgetId).toBeNull()
	})

	it('propagates widgetId when present', () => {
		const fetchedWithWidgetId: FetchedBookmark[] = [
			{
				id: 'bm-1',
				offlineId: null,
				title: 'دیجی‌کالا',
				url: 'https://digikala.com',
				icon: '',
				isManageable: true,
				type: 'BOOKMARK',
				parentId: '',
				iconIsS3Hosted: false,
				children: [],
				widgetId: 'bookmarks-instance-1',
			},
		]

		const mapped = mapBookmarks(fetchedWithWidgetId)
		expect(mapped[0].widgetId).toBe('bookmarks-instance-1')
	})

	it('filters root and nested folder items by id and onlineId', () => {
		const items: Bookmark[] = [
			{
				id: 'root-1',
				title: 'روت ۱',
				type: 'BOOKMARK',
				parentId: null,
				isLocal: true,
				onlineId: 'root-1-online',
				url: 'https://a.com',
				icon: null,
				customBackground: null,
				customTextColor: null,
				sticker: null,
				order: 0,
			},
			{
				id: 'folder-1',
				title: 'پوشه ۱',
				type: 'FOLDER',
				parentId: null,
				isLocal: true,
				onlineId: 'folder-1-online',
				url: null,
				icon: null,
				customBackground: null,
				customTextColor: null,
				sticker: null,
				order: 1,
			},
			{
				id: 'child-1',
				title: 'فرزند با offlineId',
				type: 'BOOKMARK',
				parentId: 'folder-1',
				isLocal: true,
				onlineId: 'child-1-online',
				url: 'https://b.com',
				icon: null,
				customBackground: null,
				customTextColor: null,
				sticker: null,
				order: 0,
			},
			{
				id: 'child-2',
				title: 'فرزند با onlineId',
				type: 'BOOKMARK',
				parentId: 'folder-1-online',
				isLocal: true,
				onlineId: 'child-2-online',
				url: 'https://c.com',
				icon: null,
				customBackground: null,
				customTextColor: null,
				sticker: null,
				order: 1,
			},
		]

		const rootItems = getFolderItems(items, null)
		expect(rootItems).toHaveLength(2)
		expect(rootItems.map((b) => b.id)).toEqual(['root-1', 'folder-1'])

		const folderItemsByUuid = getFolderItems(items, 'folder-1')
		expect(folderItemsByUuid).toHaveLength(2)
		expect(folderItemsByUuid.map((b) => b.id)).toEqual(['child-1', 'child-2'])

		const folderItemsByOnlineId = getFolderItems(items, 'folder-1-online')
		expect(folderItemsByOnlineId).toHaveLength(2)
	})

	it('computes default size (4x2) as 10 bookmark slots in 2 rows of 5', () => {
		const dim = computeBookmarkGridDimensions({ w: 4, h: 2 })
		expect(dim.colsCount).toBe(5)
		expect(dim.rowsCount).toBe(2)
		expect(dim.totalBookmarks).toBe(10)
	})

	it('computes 1-bookmark size (1x1) as 1 bookmark slot in 1 row of 1', () => {
		const dim = computeBookmarkGridDimensions({ w: 1, h: 1 })
		expect(dim.colsCount).toBe(1)
		expect(dim.rowsCount).toBe(1)
		expect(dim.totalBookmarks).toBe(1)
	})

	it('computes 2-bookmark size (2x1) as 2 bookmark slots in 1 row of 2', () => {
		const dim = computeBookmarkGridDimensions({ w: 2, h: 1 })
		expect(dim.colsCount).toBe(2)
		expect(dim.rowsCount).toBe(1)
		expect(dim.totalBookmarks).toBe(2)
	})

	it('computes 4-bookmark size (2x2) as 4 bookmark slots in 2 rows of 2', () => {
		const dim = computeBookmarkGridDimensions({ w: 2, h: 2 })
		expect(dim.colsCount).toBe(2)
		expect(dim.rowsCount).toBe(2)
		expect(dim.totalBookmarks).toBe(4)
	})

	it('computes vertical size (2x4) as 10 bookmark slots in 5 rows of 2', () => {
		const dim = computeBookmarkGridDimensions({ w: 2, h: 4 })
		expect(dim.colsCount).toBe(2)
		expect(dim.rowsCount).toBe(5)
		expect(dim.totalBookmarks).toBe(10)
	})

	it('pads bookmarks array with null empty slots up to total count', () => {
		const testBookmarks: Bookmark[] = [
			{
				id: '1',
				title: 'گوگل',
				type: 'BOOKMARK',
				parentId: null,
				isLocal: true,
				onlineId: '1',
				url: 'https://google.com',
				icon: null,
				customBackground: null,
				customTextColor: null,
				sticker: null,
				order: 0,
			},
		]

		const slots10 = mergeBookmarksWithEmptySlots(testBookmarks, 10)
		expect(slots10).toHaveLength(10)
		expect(slots10[0]?.title).toBe('گوگل')
		expect(slots10[1]).toBeNull()
		expect(slots10[9]).toBeNull()

		const slots2 = mergeBookmarksWithEmptySlots(testBookmarks, 2)
		expect(slots2).toHaveLength(2)
		expect(slots2[0]?.title).toBe('گوگل')
		expect(slots2[1]).toBeNull()
	})

	it('scopes bookmarks by widgetId while preserving legacy bookmarks in primary widget', () => {
		const mixedBookmarks: Bookmark[] = [
			{
				id: 'legacy-bm',
				title: 'بوکمارک قدیمی بدون ویجت',
				type: 'BOOKMARK',
				parentId: null,
				isLocal: true,
				onlineId: 'legacy-bm',
				url: 'https://legacy.com',
				icon: null,
				customBackground: null,
				customTextColor: null,
				sticker: null,
				order: 0,
			},
			{
				id: 'default-widget-bm',
				title: 'بوکمارک ویجت پیش‌فرض',
				type: 'BOOKMARK',
				parentId: null,
				isLocal: true,
				onlineId: 'default-bm',
				url: 'https://default.com',
				icon: null,
				customBackground: null,
				customTextColor: null,
				sticker: null,
				order: 1,
				widgetId: 'bookmarks-default',
			},
			{
				id: 'duplicated-widget-bm',
				title: 'بوکمارک ویجت تکراری',
				type: 'BOOKMARK',
				parentId: null,
				isLocal: true,
				onlineId: 'dup-bm',
				url: 'https://dup.com',
				icon: null,
				customBackground: null,
				customTextColor: null,
				sticker: null,
				order: 2,
				widgetId: 'bookmarks-duplicated-123',
			},
		]

		const filterForWidget = (
			widgetId?: string | null,
			isPrimary?: boolean
		) => {
			return mixedBookmarks.filter((b) => {
				if (b.parentId !== null) return false
				const shouldIncludeLegacy =
					isPrimary !== undefined
						? isPrimary
						: !widgetId || widgetId === 'bookmarks-default'

				if (shouldIncludeLegacy) {
					return (
						!b.widgetId ||
						b.widgetId === 'bookmarks-default' ||
						(widgetId ? b.widgetId === widgetId : false)
					)
				}
				return b.widgetId === widgetId
			})
		}

		// Primary / Default widget receives legacy bookmarks + its own
		const primaryItems = filterForWidget('bookmarks-default', true)
		expect(primaryItems).toHaveLength(2)
		expect(primaryItems.map((b) => b.id)).toEqual([
			'legacy-bm',
			'default-widget-bm',
		])

		// Primary widget with a dynamic MongoDB ObjectId (e.g. 6a8624e1...) ALSO receives legacy bookmarks + default
		const mongoPrimaryItems = filterForWidget('6a8624e18ad0a538d22483dd', true)
		expect(mongoPrimaryItems).toHaveLength(2)
		expect(mongoPrimaryItems.map((b) => b.id)).toEqual([
			'legacy-bm',
			'default-widget-bm',
		])

		// Generic / Simplify / Advanced view without instanceId also receives legacy bookmarks
		const genericItems = filterForWidget(null, true)
		expect(genericItems).toHaveLength(2)
		expect(genericItems.map((b) => b.id)).toEqual([
			'legacy-bm',
			'default-widget-bm',
		])

		// Duplicated / New separate instance receives ONLY its own bookmarks and starts clean
		const duplicatedItems = filterForWidget('bookmarks-duplicated-123', false)
		expect(duplicatedItems).toHaveLength(1)
		expect(duplicatedItems.map((b) => b.id)).toEqual(['duplicated-widget-bm'])

		// A brand new duplicated instance without any bookmarks yet has length 0
		const emptyNewInstance = filterForWidget('bookmarks-brand-new-999', false)
		expect(emptyNewInstance).toHaveLength(0)
	})
})
