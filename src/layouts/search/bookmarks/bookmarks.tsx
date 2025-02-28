import { Menu, MenuHandler } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { StoreKey } from '../../../common/constant/store.key'
import { getFromStorage } from '../../../common/storage'
import { useBookmarkStore } from '../../../context/bookmark.context'
import {
	type FetchedBookmark,
	useGetBookmarks,
} from '../../../services/getMethodHooks/getBookmarks.hook'
import { AddBookmarkModal } from './components/add-bookmark.modal'
import { BookmarkContextMenu } from './components/bookmark-context-menu'
import { BookmarkItem } from './components/bookmark-item'
import { FolderPath } from './components/folder-path'
import type { Bookmark, FolderPathItem } from './types/bookmark.types'

export function BookmarksComponent() {
	const { bookmarks, setBookmarks, getCurrentFolderItems, addBookmark, deleteBookmark } =
		useBookmarkStore()
	const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false)
	const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)
	const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })
	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
	const [folderPath, setFolderPath] = useState<FolderPathItem[]>([])

	const { data: fetchedBookmarks } = useGetBookmarks()

	const processFetchedBookmark = async () => {
		const unpinnedBookmarks = bookmarks.filter((b) => !b.pinned)
		const deletedBookmarks =
			(await getFromStorage<string[]>(StoreKey.DeletedBookmarks)) || []

		const pinnedBookmarks: Bookmark[] = []

		function handleBookmark(bookmark: FetchedBookmark) {
			if (deletedBookmarks.includes(bookmark.id)) return

			if (bookmark.type === 'FOLDER') {
				pinnedBookmarks.push({
					id: bookmark.id,
					title: bookmark.title,
					type: 'FOLDER',
					parentId: bookmark.parentId,
					isLocal: false,
					pinned: bookmark.pinned,
				})
			} else {
				pinnedBookmarks.push({
					id: bookmark.id,
					title: bookmark.title,
					type: 'BOOKMARK',
					parentId: bookmark.parentId,
					isLocal: false,
					pinned: bookmark.pinned,
					url: bookmark.url,
					icon: bookmark.icon,
				})
			}

			for (const child of bookmark.children) {
				handleBookmark(child)
			}
		}

		for (const bookmark of fetchedBookmarks) {
			handleBookmark(bookmark)
		}

		setBookmarks([...pinnedBookmarks, ...unpinnedBookmarks])
	}

	useEffect(() => {
		processFetchedBookmark()
	}, [fetchedBookmarks])

	useEffect(() => {
		const handleClickOutside = () => setSelectedBookmark(null)
		document.addEventListener('click', handleClickOutside)

		return () => document.removeEventListener('click', handleClickOutside)
	}, [])

	const handleRightClick = (e: React.MouseEvent, bookmark: Bookmark) => {
		e.preventDefault()
		if (!bookmark.pinned) {
			setSelectedBookmark(bookmark)
			setContextMenuPos({ x: e.clientX, y: e.clientY })
		}
	}

	const handleBookmarkClick = (bookmark: Bookmark) => {
		if (bookmark.type === 'FOLDER') {
			setCurrentFolderId(bookmark.id)
			setFolderPath([...folderPath, { id: bookmark.id, title: bookmark.title }])
		} else {
			window.location.href = bookmark.url
		}
	}

	const handleBackClick = () => {
		if (folderPath.length === 0) return

		const newPath = [...folderPath]
		newPath.pop()
		setFolderPath(newPath)
		setCurrentFolderId(newPath[newPath.length - 1]?.id ?? null)
	}

	const currentFolderItems = getCurrentFolderItems(currentFolderId)
	const displayedBookmarks = currentFolderItems
		.slice(0, 10)
		.concat(new Array(Math.max(0, 10 - currentFolderItems.length)).fill(null))

	return (
		<>
			<div className="flex flex-row flex-wrap justify-center w-full gap-1 mt-3">
				{displayedBookmarks.map((bookmark, i) =>
					bookmark ? (
						<Menu key={i} open={selectedBookmark?.id === bookmark.id}>
							<MenuHandler>
								<div onContextMenu={(e) => handleRightClick(e, bookmark)}>
									<BookmarkItem
										bookmark={bookmark}
										onClick={() => handleBookmarkClick(bookmark)}
									/>
								</div>
							</MenuHandler>
							{selectedBookmark?.id === bookmark.id && (
								<BookmarkContextMenu
									position={contextMenuPos}
									onDelete={() => deleteBookmark(bookmark.id)}
								/>
							)}
						</Menu>
					) : (
						<BookmarkItem
							key={i}
							bookmark={null}
							onClick={() => setShowAddBookmarkModal(true)}
						/>
					),
				)}
			</div>

			<FolderPath folderPath={folderPath} onBackClick={handleBackClick} />

			<AddBookmarkModal
				isOpen={showAddBookmarkModal}
				onClose={() => setShowAddBookmarkModal(false)}
				onAdd={(bookmark) => addBookmark(bookmark)}
				parentId={currentFolderId}
			/>
		</>
	)
}
