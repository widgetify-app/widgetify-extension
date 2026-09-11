export type FetchedBrowserBookmarkType = 'BOOKMARK' | 'FOLDER'

export interface FetchedBrowserBookmark {
	id: string
	title: string
	url: string | null
	dateAdded: number
	type: FetchedBrowserBookmarkType
	parentId?: string | null
	children?: FetchedBrowserBookmark[]
}

interface GetBrowserBookmarksOptions {
	/**
	 * When true, include folder nodes in the returned list (flat)
	 */
	includeFolders?: boolean
	/**
	 * When true, return a tree structure with `children` arrays
	 */
	asTree?: boolean
}

export async function getBrowserBookmarks(
	options: GetBrowserBookmarksOptions = {}
): Promise<FetchedBrowserBookmark[]> {
	const { includeFolders = false, asTree = false } = options

	if (!browser.bookmarks) return []
	const roots = await browser.bookmarks.getTree()

	if (asTree) {
		// Map BookmarkTreeNode -> FetchedBrowserBookmark preserving hierarchy
		const mapNode = (
			node: globalThis.Browser.bookmarks.BookmarkTreeNode,
			parentId: string | null
		): FetchedBrowserBookmark => {
			const isBookmark = !!node.url
			const mapped: FetchedBrowserBookmark = {
				id: node.id,
				title: node.title,
				url: node.url || null,
				dateAdded: node.dateAdded || Date.now(),
				type: isBookmark ? 'BOOKMARK' : 'FOLDER',
				parentId,
			}

			if (node.children?.length) {
				mapped.children = node.children.map((c) => mapNode(c, node.id))
				// sort children by dateAdded desc
				mapped.children.sort((a, b) => (a.dateAdded > b.dateAdded ? -1 : 1))
			}

			return mapped
		}

		const mappedRoots = roots.map((r) => mapNode(r, null))
		return mappedRoots
	}

	// Flattened list behaviour (backwards compatible)
	const items: FetchedBrowserBookmark[] = []

	const walk = (
		nodes: globalThis.Browser.bookmarks.BookmarkTreeNode[],
		parentId: string | null
	) => {
		for (const node of nodes) {
			const isBookmark = !!node.url
			if (isBookmark) {
				items.push({
					id: node.id,
					title: node.title,
					url: node.url || null,
					dateAdded: node.dateAdded || Date.now(),
					type: 'BOOKMARK',
					parentId,
				})
			} else {
				// folder node
				if (includeFolders) {
					items.push({
						id: node.id,
						title: node.title,
						url: null,
						dateAdded: node.dateAdded || Date.now(),
						type: 'FOLDER',
						parentId,
					})
				}

				if (node.children) {
					walk(node.children, node.id)
				}
			}
		}
	}

	for (const root of roots) {
		if (root.children) walk(root.children, null)
	}

	// sort by dateAdded desc
	return items.sort((a, b) => (a.dateAdded > b.dateAdded ? -1 : 1))
}
