import { useBookmarkStore } from '@/context/bookmark.context'
import { useTheme } from '@/context/theme.context'

import { useEffect, useState } from 'react'
import { AddBookmarkModal } from './components/add-bookmark.modal'
import { BookmarkContextMenu } from './components/bookmark-context-menu'
import { BookmarkItem } from './components/bookmark-item'
import { EditBookmarkModal } from './components/edit-bookmark.modal'
import { FolderPath } from './components/folder-path'
import type { Bookmark, FolderPathItem } from './types/bookmark.types'

export function BookmarksComponent() {
	const { theme, themeUtils } = useTheme()

	const { bookmarks, getCurrentFolderItems, addBookmark, editBookmark, deleteBookmark } =
		useBookmarkStore()

	const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false)
	const [showEditBookmarkModal, setShowEditBookmarkModal] = useState(false)
	const [bookmarkToEdit, setBookmarkToEdit] = useState<Bookmark | null>(null)

	const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)

	const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })

	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)

	const [folderPath, setFolderPath] = useState<FolderPathItem[]>([])

	const [currentFolderIsManageable, setCurrentFolderIsManageable] =
		useState<boolean>(true)

	// Number of bookmarks per row
	const BOOKMARKS_PER_ROW = 5
	// Total number of bookmarks to display (2 rows)
	const TOTAL_BOOKMARKS = BOOKMARKS_PER_ROW * 2

	useEffect(() => {
		const handleClickOutside = () => setSelectedBookmark(null)
		document.addEventListener('click', handleClickOutside)

		return () => document.removeEventListener('click', handleClickOutside)
	}, [])

	const isManageable = (bookmark: Bookmark) => {
		if ('isManageable' in bookmark && typeof bookmark.isManageable === 'boolean') {
			return bookmark.isManageable
		}

		return true
	}

	const handleRightClick = (e: React.MouseEvent, bookmark: Bookmark) => {
		e.preventDefault()
		if (isManageable(bookmark)) {
			setSelectedBookmark(bookmark)
			const parent = e.currentTarget
			if (parent) {
				const rect = parent.getBoundingClientRect()
				setContextMenuPos({ x: rect.right - 120, y: rect.top + 80 })
			}
		}
	}

	const handleEditBookmark = (bookmark: Bookmark) => {
		setBookmarkToEdit(bookmark)
		setShowEditBookmarkModal(true)
		setSelectedBookmark(null)
	}

	const handleBookmarkClick = (bookmark: Bookmark, e?: React.MouseEvent<any>) => {
		if (bookmark.type === 'FOLDER') {
			if (e?.ctrlKey || e?.metaKey) {
				const children = getCurrentFolderItems(bookmark.id)
				const bookmarks = children.filter((b) => b.type === 'BOOKMARK')
				for (const b of bookmarks) {
					window.open(b.url)
				}
			} else {
				setCurrentFolderId(bookmark.id)
				setFolderPath([...folderPath, { id: bookmark.id, title: bookmark.title }])

				setCurrentFolderIsManageable(isManageable(bookmark))
			}
		} else {
			if (e?.ctrlKey || e?.metaKey) {
				window.open(bookmark.url)
			} else {
				window.location.href = bookmark.url
			}
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
				setCurrentFolderIsManageable(isManageable(folder))
			}
		} else {
			setCurrentFolderIsManageable(true)
		}
	}

	async function onOpenInNewTab(bookmark: Bookmark) {
		if (bookmark?.type === 'FOLDER') {
			const children = getCurrentFolderItems(bookmark.id)
			const bookmarks = children.filter((b) => b.type === 'BOOKMARK')
			for (const b of bookmarks) {
				window.open(b.url)
			}
		}

		if (bookmark && bookmark.type === 'BOOKMARK') {
			window.open(bookmark.url)
		}
	}

	const currentFolderItems = getCurrentFolderItems(currentFolderId)

	const displayedBookmarks = currentFolderItems
		.slice(0, TOTAL_BOOKMARKS)
		.concat(
			new Array(
				Math.max(
					0,
					TOTAL_BOOKMARKS -
						currentFolderItems.length -
						(currentFolderIsManageable ? 1 : 0),
				),
			).fill(null),
		)
		.concat(
			//@ts-ignore
			currentFolderIsManageable && currentFolderItems.length < TOTAL_BOOKMARKS
				? [null]
				: [],
		)
		.slice(0, TOTAL_BOOKMARKS)

	return (
		<>
			<div
				className={`grid grid-cols-5 gap-3 w-full mt-3 p-2 rounded-lg transition-all duration-300 ${themeUtils.getTextColor()}`}
			>
				{displayedBookmarks.map((bookmark, i) =>
					bookmark ? (
						<div
							key={i}
							onContextMenu={(e) => handleRightClick(e, bookmark)}
							className="transition-transform duration-200 transform hover:scale-105"
						>
							<BookmarkItem
								bookmark={bookmark}
								onClick={(e) => handleBookmarkClick(bookmark, e)}
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
						onEdit={() => handleEditBookmark(selectedBookmark)}
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
			/>
			{bookmarkToEdit && (
				<EditBookmarkModal
					isOpen={showEditBookmarkModal}
					onClose={() => setShowEditBookmarkModal(false)}
					onSave={(bookmark) => editBookmark(bookmark)}
					bookmark={bookmarkToEdit}
				/>
			)}
		</>
	)
}
