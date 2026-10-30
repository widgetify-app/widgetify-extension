export interface BookmarkNode {
	id: string
	title: string
	url: string | null
	type: 'BOOKMARK' | 'FOLDER'
	children?: BookmarkNode[]
}

interface BookmarkSearchResult {
	bookmark: BookmarkNode
	path: BookmarkNode[]
}

export function topFolders(roots: BookmarkNode[]): BookmarkNode[] {
	const children = roots.length === 1 ? roots[0].children : undefined
	return (children ?? roots).filter((node) => node.type === 'FOLDER')
}

export function folderPath(folders: BookmarkNode[], id: string | null): BookmarkNode[] {
	if (!id) return []
	for (const folder of folders) {
		if (folder.id === id) return [folder]
		const inner = folderPath(subfolders(folder), id)
		if (inner.length) return [folder, ...inner]
	}
	return []
}

export function subfolders(folder: BookmarkNode): BookmarkNode[] {
	return (folder.children ?? []).filter((node) => node.type === 'FOLDER')
}

export function openFolder(
	folders: BookmarkNode[],
	id: string | null
): BookmarkNode | null {
	const path = folderPath(folders, id)
	return path[path.length - 1] ?? folders[0] ?? null
}

export function searchBookmarks(
	folders: BookmarkNode[],
	query: string,
	limit = 50
): BookmarkSearchResult[] {
	const needle = query.trim().toLowerCase()
	if (!needle) return []

	const results: BookmarkSearchResult[] = []
	const walk = (nodes: BookmarkNode[], path: BookmarkNode[]) => {
		for (const node of nodes) {
			if (results.length >= limit) return
			if (node.type === 'FOLDER') {
				walk(node.children ?? [], [...path, node])
				continue
			}
			const haystack = `${node.title} ${node.url ?? ''}`.toLowerCase()
			if (haystack.includes(needle)) results.push({ bookmark: node, path })
		}
	}
	walk(folders, [])
	return results
}

export function hostOf(url: string | null): string {
	if (!url) return ''
	try {
		return new URL(url).hostname.replace(/^www\./, '')
	} catch {
		return ''
	}
}
