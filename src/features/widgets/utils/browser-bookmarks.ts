type FetchedBrowserBookmarkType = 'BOOKMARK' | 'FOLDER'

export interface FetchedBrowserBookmark {
	id: string
	title: string
	url: string | null
	dateAdded: number
	type: FetchedBrowserBookmarkType
	parentId?: string | null
	children?: FetchedBrowserBookmark[]
}

interface GetBrowserBookmarkTreeOptions {
	newestFirst?: boolean
}

export async function getBrowserBookmarkTree(
	options: GetBrowserBookmarkTreeOptions = {}
): Promise<FetchedBrowserBookmark[]> {
	const { newestFirst = false } = options

	if (!browser.bookmarks) return []
	const roots = await browser.bookmarks.getTree()

	const mapNode = (
		node: globalThis.Browser.bookmarks.BookmarkTreeNode,
		parentId: string | null
	): FetchedBrowserBookmark => {
		const mapped: FetchedBrowserBookmark = {
			id: node.id,
			title: node.title,
			url: node.url || null,
			dateAdded: node.dateAdded || Date.now(),
			type: node.url ? 'BOOKMARK' : 'FOLDER',
			parentId,
		}

		if (node.children?.length) {
			mapped.children = node.children.map((child) => mapNode(child, node.id))
			if (newestFirst) {
				mapped.children.sort((a, b) => (a.dateAdded > b.dateAdded ? -1 : 1))
			}
		}

		return mapped
	}

	return roots.map((root) => mapNode(root, null))
}
