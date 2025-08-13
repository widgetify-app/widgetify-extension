export interface FetchedBrowserBookmark {
	id: string
	title: string
	url: string | null
	dateAdded: number
}

export async function getBrowserBookmarks(): Promise<FetchedBrowserBookmark[]> {
	if (!browser.bookmarks) return []
	const children = await browser.bookmarks.getTree()
	const bookmarkItems: FetchedBrowserBookmark[] = []
	for (const child of children) {
		const result = extractChild(child.children || [])
		bookmarkItems.push(...result)
	}

	return bookmarkItems
}

function extractChild(
	children: globalThis.Browser.bookmarks.BookmarkTreeNode[]
): FetchedBrowserBookmark[] {
	const result: FetchedBrowserBookmark[] = []
	for (const child of children) {
		if (child.url) {
			result.push({
				id: child.id,
				title: child.title,
				url: child.url,
				dateAdded: child.dateAdded || Date.now(),
			})
		} else if (child.children) {
			result.push(...extractChild(child.children))
		}
	}
	return result.sort((a, b) => (a.dateAdded > b.dateAdded ? -1 : 1))
}
