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

	const tabs = await Promise.all(
		children.map((b) => browser.tabs.create({ url: b.url, active: false }))
	)

	const tabIds = tabs.map((tab) => tab.id).filter((id): id is number => id !== null)

	if (tabIds.length > 0) {
		const groupId = await browser.tabs.group({
			tabIds: tabIds as [number, ...number[]],
		})

		await browser.tabGroups.update(groupId, {
			title: bookmark.title || 'Bookmarks',
			color: COLORS[Math.floor(Math.random() * COLORS.length)] as any,
		})
	}
}
