import { getFromStorage } from '@/common/storage'
import { useBookmarkStore } from '@/context/bookmark.context'
import { useTheme } from '@/context/theme.context'
import {
	type FetchedSuggestionsBookmark,
	useGetBookmarks,
} from '@/services/getMethodHooks/getBookmarks.hook'
import { useEffect, useState } from 'react'
import { AddBookmarkModal } from './components/add-bookmark.modal'
import { BookmarkContextMenu } from './components/bookmark-context-menu'
import { BookmarkItem } from './components/bookmark-item'
import { FolderPath } from './components/folder-path'
import type { Bookmark, FolderPathItem } from './types/bookmark.types'

export function BookmarksComponent() {
	const { theme, themeUtils } = useTheme()
	const { bookmarks, setBookmarks, getCurrentFolderItems, addBookmark, deleteBookmark } =
		useBookmarkStore()
	const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false)
	const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)
	const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })
	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
	const [folderPath, setFolderPath] = useState<FolderPathItem[]>([])
	const [currentFolderIsManageable, setCurrentFolderIsManageable] =
		useState<boolean>(true)

	const { data: fetchedBookmarks } = useGetBookmarks()

	const processFetchedBookmark = async () => {
		const unpinnedBookmarks = bookmarks.filter((b) => !b.isManageable)
		const deletedBookmarks = (await getFromStorage('deletedBookmarkIds')) || []

		const pinnedBookmarks: Bookmark[] = []

		function handleBookmark(bookmark: FetchedSuggestionsBookmark) {
			if (deletedBookmarks.includes(bookmark.id)) return

			if (bookmark.type === 'FOLDER') {
				pinnedBookmarks.push({
					id: bookmark.id,
					title: bookmark.title,
					type: 'FOLDER',
					parentId: bookmark.parentId,
					isLocal: false,
					isManageable: bookmark.isManageable,
				})
			} else {
				pinnedBookmarks.push({
					id: bookmark.id,
					title: bookmark.title,
					type: 'BOOKMARK',
					parentId: bookmark.parentId,
					isLocal: false,
					isManageable: bookmark.isManageable,
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
		if (bookmark.isManageable) {
			setSelectedBookmark(bookmark)
			const parent = e.currentTarget
			if (parent) {
				const rect = parent.getBoundingClientRect()
				setContextMenuPos({ x: rect.right - 120, y: rect.top + 80 })
			}
		}
	}

	const handleBookmarkClick = (bookmark: Bookmark) => {
		if (bookmark.type === 'FOLDER') {
			setCurrentFolderId(bookmark.id)
			setFolderPath([...folderPath, { id: bookmark.id, title: bookmark.title }])
			if (typeof bookmark.isManageable === 'boolean') {
				setCurrentFolderIsManageable(bookmark.isManageable)
			}
		} else {
			window.location.href = bookmark.url
		}
	}

	const handleNavigate = (folderId: string | null, depth: number) => {
		if (depth === -1) {
			setFolderPath([])
			setCurrentFolderId(null)
			setCurrentFolderIsManageable(true)
			return
		}

		const newPath = folderPath.slice(0, depth + 1)
		setFolderPath(newPath)
		setCurrentFolderId(folderId)

		if (folderId) {
			const folder = bookmarks.find((b) => b.id === folderId)
			if (folder) {
				setCurrentFolderIsManageable(folder.isManageable)
			}
		} else {
			setCurrentFolderIsManageable(true)
		}
	}

	function onOpenInNewTab(bookmark: Bookmark) {
		if (bookmark && bookmark.type === 'BOOKMARK') {
			window.open(bookmark.url, '_blank')
		}
	}

	const currentFolderItems = getCurrentFolderItems(currentFolderId)
	const displayedBookmarks = currentFolderItems
		.slice(0, 10)
		.concat(new Array(Math.max(0, 10 - currentFolderItems.length)).fill(null))

	return (
		<>
			<div
				className={`flex flex-row flex-wrap justify-center w-full gap-2 mt-2 p-1 ${themeUtils.getTextColor()}`}
			>
				{displayedBookmarks.map((bookmark, i) =>
					bookmark ? (
						<div key={i} onContextMenu={(e) => handleRightClick(e, bookmark)}>
							<BookmarkItem
								bookmark={bookmark}
								onClick={() => handleBookmarkClick(bookmark)}
								theme={theme}
								canAdd={true}
							/>
						</div>
					) : (
						<BookmarkItem
							key={i}
							bookmark={null}
							onClick={() => setShowAddBookmarkModal(true)}
							theme={theme}
							canAdd={currentFolderIsManageable}
						/>
					),
				)}
				{selectedBookmark && (
					<BookmarkContextMenu
						position={contextMenuPos}
						onDelete={() => {
							deleteBookmark(selectedBookmark.id)
							setSelectedBookmark(null)
						}}
						isFolder={selectedBookmark.type === 'FOLDER'}
						onOpenInNewTab={() => onOpenInNewTab(selectedBookmark)}
						theme={theme}
					/>
				)}
			</div>

			<FolderPath folderPath={folderPath} onNavigate={handleNavigate} theme={theme} />

			<AddBookmarkModal
				isOpen={showAddBookmarkModal}
				onClose={() => setShowAddBookmarkModal(false)}
				onAdd={(bookmark) => addBookmark(bookmark)}
				parentId={currentFolderId}
				theme={theme}
			/>
		</>
	)
}
