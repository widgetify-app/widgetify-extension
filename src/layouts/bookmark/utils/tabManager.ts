import type { Bookmark } from '../types/bookmark.types'

export async function openBookmarksOptimized(bookmark: Bookmark, children: Bookmark[]) {
	const COLORS = [
		'blue',
		'cyan',
		'green',
		'grey',
		'orange',
		'pink',
		'purple',
		'red',
		'yellow',
	]

	const nonEmptyUrls = children.filter((b) => b.url && b.url.trim().length > 0)
	if (nonEmptyUrls.length === 0) return

	const tabs = await Promise.all(
		nonEmptyUrls.map((b) => browser.tabs.create({ url: b.url || '', active: false }))
	)

	const tabIds = tabs.map((tab) => tab.id).filter((id): id is number => id !== null)

	if (tabIds.length > 0 && browser.tabs.group && browser.tabGroups) {
		const groupId = await browser.tabs.group({
			tabIds: tabIds as [number, ...number[]],
		})

		await browser.tabGroups.update(groupId, {
			title: bookmark.title || 'Bookmarks',
			color: COLORS[Math.floor(Math.random() * COLORS.length)] as any,
		})
	}
}
