import { useBookmarkStore } from '@/context/bookmark.context'
import { getTextColor, useTheme } from '@/context/theme.context'

import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { SyncTarget } from '@/layouts/navbar/sync/sync'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BookmarkItem } from './components/bookmark-item'
import { FolderPath } from './components/folder-path'
import { AddBookmarkModal } from './components/modal/add-bookmark.modal'
import { BookmarkContextMenu } from './components/modal/bookmark-context-menu'
import { EditBookmarkModal } from './components/modal/edit-bookmark.modal'
import type { Bookmark, FolderPathItem } from './types/bookmark.types'

export function BookmarksComponent() {
	const { theme } = useTheme()

	const {
		bookmarks,
		getCurrentFolderItems,
		addBookmark,
		editBookmark,
		deleteBookmark,
		setBookmarks,
	} = useBookmarkStore()

	const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false)
	const [showEditBookmarkModal, setShowEditBookmarkModal] = useState(false)
	const [bookmarkToEdit, setBookmarkToEdit] = useState<Bookmark | null>(null)

	const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)

	const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })

	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)

	const [folderPath, setFolderPath] = useState<FolderPathItem[]>([])

	const [currentFolderIsManageable, setCurrentFolderIsManageable] =
		useState<boolean>(true)

	const [draggedBookmarkId, setDraggedBookmarkId] = useState<string | null>(null)
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

	const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const BOOKMARKS_PER_ROW = 5
	const TOTAL_BOOKMARKS = BOOKMARKS_PER_ROW * 2

	const debouncedSync = useCallback(() => {
		if (syncTimeoutRef.current) {
			clearTimeout(syncTimeoutRef.current)
		}

		syncTimeoutRef.current = setTimeout(() => {
			callEvent('startSync', SyncTarget.BOOKMARKS)
			Analytics.featureUsed('drag-and-drop-bookmark', {}, 'drag')
			syncTimeoutRef.current = null
		}, 1000) // Wait 1 second before triggering sync
	}, [])

	useEffect(() => {
		const handleClickOutside = () => setSelectedBookmark(null)
		document.addEventListener('click', handleClickOutside)

		return () => {
			document.removeEventListener('click', handleClickOutside)
			if (syncTimeoutRef.current) {
				clearTimeout(syncTimeoutRef.current)
			}
		}
	}, [])

	const isManageable = (bookmark: Bookmark) => {
		if ('isManageable' in bookmark && typeof bookmark.isManageable === 'boolean') {
			return bookmark.isManageable
		}

		return true
	}
	const handleMenuClick = (e: React.MouseEvent<HTMLElement>, bookmark: Bookmark) => {
		e.preventDefault()
		if (isManageable(bookmark)) {
			setSelectedBookmark(bookmark)
			const button = e.currentTarget
			if (button) {
				const rect = button.getBoundingClientRect()
				setContextMenuPos({ x: rect.left - 110, y: rect.bottom + 5 })
			}
		}
	}

	const handleEditBookmark = (bookmark: Bookmark) => {
		setBookmarkToEdit(bookmark)
		setShowEditBookmarkModal(true)
		setSelectedBookmark(null)
	}
	const handleBookmarkClick = (bookmark: Bookmark, e?: React.MouseEvent<any>) => {
		if (e) {
			e.preventDefault()
		}
		if (e?.button === 2) return

		if (e?.button === 1) {
			if (bookmark.type === 'FOLDER') {
				openBookmarks(bookmark)
			} else {
				window.open(bookmark.url)
			}
			return
		}

		if (bookmark.type === 'FOLDER') {
			if (e?.ctrlKey || e?.metaKey) {
				openBookmarks(bookmark)
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

	const handleDragStart = (e: React.DragEvent<HTMLDivElement>, bookmarkId: string) => {
		if (bookmarks.find((b) => b.id === bookmarkId && !isManageable(b))) return

		setDraggedBookmarkId(bookmarkId)
		e.dataTransfer.effectAllowed = 'move'

		const dragImage = document.createElement('div')
		dragImage.style.width = '80px'
		dragImage.style.height = '90px'
		dragImage.style.opacity = '0.5'
		dragImage.style.position = 'absolute'
		dragImage.style.top = '-1000px'
		document.body.appendChild(dragImage)

		e.dataTransfer.setDragImage(dragImage, 40, 45)

		setTimeout(() => {
			document.body.removeChild(dragImage)
		}, 0)
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
		e.preventDefault()
		e.dataTransfer.dropEffect = 'move'
		setDragOverIndex(index)
	}

	const handleDragEnd = () => {
		setDraggedBookmarkId(null)
		setDragOverIndex(null)
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
		e.preventDefault()

		if (!draggedBookmarkId) return

		const currentItems = getCurrentFolderItems(currentFolderId)
		const sourceIndex = currentItems.findIndex((item) => item.id === draggedBookmarkId)

		if (sourceIndex === -1 || sourceIndex === targetIndex) {
			setDraggedBookmarkId(null)
			setDragOverIndex(null)
			return
		}

		const allBookmarks = [...bookmarks]

		const sourceBookmark = currentItems[sourceIndex]
		const actualSourceIndex = allBookmarks.findIndex((b) => b.id === sourceBookmark.id)
		const targetBookmark = currentItems[targetIndex]
		const actualTargetIndex = allBookmarks.findIndex((b) => b.id === targetBookmark.id)

		if (actualSourceIndex !== -1 && actualTargetIndex !== -1) {
			const [movedBookmark] = allBookmarks.splice(actualSourceIndex, 1)

			allBookmarks.splice(actualTargetIndex, 0, movedBookmark)

			const updatedBookmarks = allBookmarks.map((bookmark) => {
				if (bookmark.parentId === currentFolderId) {
					const newIndex = allBookmarks.findIndex((b) => b.id === bookmark.id)
					return { ...bookmark, order: newIndex }
				}
				return bookmark
			})

			setBookmarks(updatedBookmarks)

			debouncedSync()
		}

		setDraggedBookmarkId(null)
		setDragOverIndex(null)
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

	function openBookmarks(bookmark: Bookmark) {
		const children = getCurrentFolderItems(bookmark.id)
		const bookmarks = children.filter((b) => b.type === 'BOOKMARK')
		for (const b of bookmarks) {
			window.open(b.url)
		}
	}

	async function onOpenInNewTab(bookmark: Bookmark) {
		if (bookmark?.type === 'FOLDER') {
			openBookmarks(bookmark)
		}

		if (bookmark && bookmark.type === 'BOOKMARK') {
			window.open(bookmark.url)
		}

		setSelectedBookmark(null)
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
				className={`grid grid-cols-5 gap-3 w-full mt-2 p-1 rounded-lg transition-all duration-300 ${getTextColor(theme)}`}
			>
				{' '}
				{displayedBookmarks.map((bookmark, i) =>
					bookmark ? (
						<div
							key={i}
							className={`transition-transform duration-200 ${dragOverIndex === i ? 'scale-110 border-2 border-blue-400 rounded-xl' : ''}`}
						>
							<BookmarkItem
								bookmark={bookmark}
								onClick={(e) => handleBookmarkClick(bookmark, e)}
								theme={theme}
								canAdd={true}
								draggable={isManageable(bookmark)}
								isDragging={draggedBookmarkId === bookmark.id}
								onDragStart={(e) => handleDragStart(e, bookmark.id)}
								onDragOver={(e) => handleDragOver(e, i)}
								onMenuClick={
									isManageable(bookmark) ? (e) => handleMenuClick(e, bookmark) : undefined
								}
								onDragEnd={handleDragEnd}
								onDrop={(e) => handleDrop(e, i)}
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
			<div className="flex justify-center w-full">
				<FolderPath folderPath={folderPath} onNavigate={handleNavigate} theme={theme} />
			</div>
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
