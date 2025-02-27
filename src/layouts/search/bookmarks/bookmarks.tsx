import { Menu, MenuHandler } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { StoreKey } from '../../../common/constant/store.key'
import { getFromStorage, setToStorage } from '../../../common/storage'
import { useBookmarkStore } from '../../../context/bookmark.context'
import { useGetBookmarks } from '../../../services/getMethodHooks/getBookmarks.hook'
import { AddBookmarkModal } from './components/add-bookmark.modal'
import { BookmarkContextMenu } from './components/bookmark-context-menu'
import { BookmarkItem } from './components/bookmark-item'
import { FolderPath } from './components/folder-path'
import type { Bookmark, FolderPathItem } from './types/bookmark.types'

export function BookmarksComponent() {
	const { bookmarks, setBookmarks, getCurrentFolderItems } = useBookmarkStore()
	const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false)
	const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)
	const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })
	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
	const [folderPath, setFolderPath] = useState<FolderPathItem[]>([])

	const { data: fetchedBookmarks } = useGetBookmarks()

	useEffect(() => {
		const handleClickOutside = () => setSelectedBookmark(null)
		document.addEventListener('click', handleClickOutside)
		return () => document.removeEventListener('click', handleClickOutside)
	}, [])

	useEffect(() => {
		if (Array.isArray(fetchedBookmarks)) {
			const unpinnedBookmarks = bookmarks.filter((b) => !b.pinned)

			const pinnedBookmarks = fetchedBookmarks.map((bookmark) => ({
				...bookmark,
				isLocal: false,
				type: 'BOOKMARK' as const,
				pinned: true,
				parentId: null,
			}))

			setBookmarks([...pinnedBookmarks, ...unpinnedBookmarks])
		}
	}, [fetchedBookmarks])

	const handleDeleteBookmark = async () => {
		if (!selectedBookmark) return

		const bookmarkIndex = bookmarks.findIndex(
			(bookmark) => !bookmark.pinned && bookmark.id === selectedBookmark.id,
		)

		if (bookmarkIndex === -1) return

		const bookmark = bookmarks[bookmarkIndex]

		// Handle folder deletion
		if (bookmark.type === 'FOLDER') {
			await handleFolderDeletion(bookmark)
		}

		// Track remote bookmark deletion
		if (!bookmark.isLocal) {
			const deletedBookmarks =
				(await getFromStorage<string[]>(StoreKey.DeletedBookmarks)) || []
			deletedBookmarks.push(bookmark.id)
			await setToStorage(StoreKey.DeletedBookmarks, deletedBookmarks)
		}

		// Update bookmarks state
		const newBookmarks = [...bookmarks]
		newBookmarks.splice(bookmarkIndex, 1)
		setBookmarks(newBookmarks)
		setSelectedBookmark(null)
	}

	const handleFolderDeletion = async (bookmark: Bookmark) => {
		const itemsToDelete = bookmarks.filter((b) => b.parentId === bookmark.id)

		for (const item of itemsToDelete) {
			if (!item.isLocal) {
				const deletedBookmarks =
					(await getFromStorage<string[]>(StoreKey.DeletedBookmarks)) || []
				deletedBookmarks.push(item.id)
				await setToStorage(StoreKey.DeletedBookmarks, deletedBookmarks)
			}
		}
	}

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
			window.open(bookmark.url)
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
									onDelete={handleDeleteBookmark}
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
				onAdd={(bookmark) => setBookmarks([...bookmarks, bookmark])}
				parentId={currentFolderId}
			/>
		</>
	)
}
