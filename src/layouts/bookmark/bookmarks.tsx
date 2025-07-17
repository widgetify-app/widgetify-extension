import { useBookmarkStore } from '@/context/bookmark.context'

import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { SyncTarget } from '@/layouts/navbar/sync/sync'
import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { BookmarkItem } from './components/bookmark-item'
import { FolderPath } from './components/folder-path'
import { AddBookmarkModal } from './components/modal/add-bookmark.modal'
import { BookmarkContextMenu } from './components/modal/bookmark-context-menu'
import { EditBookmarkModal } from './components/modal/edit-bookmark.modal'
import type { Bookmark, FolderPathItem } from './types/bookmark.types'
import { FolderPasswordModal } from './components/modal/folder-password.modal'

// --- BookmarkGrid: Extracted for clarity ---
function BookmarkGrid({
	displayedBookmarks,
	dragOverIndex,
	draggedBookmarkId,
	isManageable,
	handleBookmarkClick,
	handleMenuClick,
	handleDragStart,
	handleDragOver,
	handleDragEnd,
	handleDrop,
	setShowAddBookmarkModal,
	currentFolderIsManageable,
}: {
	displayedBookmarks: (Bookmark | null)[]
	dragOverIndex: number | null
	draggedBookmarkId: string | null
	isManageable: (bookmark: Bookmark) => boolean
	handleBookmarkClick: (
		bookmark: Bookmark,
		e?: React.MouseEvent<Element, MouseEvent>
	) => void
	handleMenuClick: (
		e: React.MouseEvent<Element, MouseEvent>,
		bookmark: Bookmark
	) => void
	handleDragStart: (e: React.DragEvent<HTMLDivElement>, bookmarkId: string) => void
	handleDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void
	handleDragEnd: (e: React.DragEvent<HTMLDivElement>) => void
	handleDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void
	setShowAddBookmarkModal: (show: boolean) => void
	currentFolderIsManageable: boolean
}) {
	return (
		<div
			className={
				'grid grid-cols-5 gap-4 lg:gap-3 lg:px-1 w-full rounded-lg transition-all duration-300'
			}
		>
			{displayedBookmarks.map((bookmark, i) =>
				bookmark ? (
					<div
						key={i}
						className={`transition-transform duration-200 ${dragOverIndex === i ? 'scale-110 border-2 border-blue-400 rounded-full' : 'rounded-full'}`}
					>
						<BookmarkItem
							bookmark={bookmark}
							onMouseDown={(e) => handleBookmarkClick(bookmark, e)}
							onClick={(e) => {
								if (e && e.button === 0) handleBookmarkClick(bookmark, e)
							}}
							canAdd={true}
							draggable={isManageable(bookmark)}
							isDragging={draggedBookmarkId === bookmark.id}
							onDragStart={(e) => handleDragStart(e, bookmark.id)}
							onDragOver={(e) => handleDragOver(e, i)}
							onMenuClick={
								isManageable(bookmark)
									? (e) => handleMenuClick(e, bookmark)
									: undefined
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
						canAdd={currentFolderIsManageable}
					/>
				)
			)}
		</div>
	)
}

export function BookmarksComponent() {
	// --- State ---
	const {
		bookmarks,
		getCurrentFolderItems,
		addBookmark,
		editBookmark,
		deleteBookmark,
		setBookmarks,
	} = useBookmarkStore()

	// Modal and selection state
	const [modals, setModals] = useState({
		add: false,
		edit: false,
		folderPassword: false,
	})
	const [bookmarkToEdit, setBookmarkToEdit] = useState<Bookmark | null>(null)
	const [folderPassword, setFolderPassword] = useState('')
	const [folderToOpen, setFolderToOpen] = useState<Bookmark | null>(null)
	const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)
	const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })
	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
	const [folderPath, setFolderPath] = useState<FolderPathItem[]>([])
	const [currentFolderIsManageable, setCurrentFolderIsManageable] =
		useState<boolean>(true)
	const [draggedBookmarkId, setDraggedBookmarkId] = useState<string | null>(null)
	const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
	const [pendingEditBookmark, setPendingEditBookmark] = useState<Bookmark | null>(null)
	const [isPasswordForEdit, setIsPasswordForEdit] = useState(false)
	const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	// --- Constants ---
	const BOOKMARKS_PER_ROW = 5
	const TOTAL_BOOKMARKS = BOOKMARKS_PER_ROW * 2

	// --- Utility functions ---
	const isManageable = (bookmark: Bookmark) =>
		'isManageable' in bookmark && typeof bookmark.isManageable === 'boolean'
			? bookmark.isManageable
			: true

	// --- Debounced sync ---
	const debouncedSync = useCallback(() => {
		if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
		syncTimeoutRef.current = setTimeout(() => {
			callEvent('startSync', SyncTarget.BOOKMARKS)
			Analytics.featureUsed('drag-and-drop-bookmark', {}, 'drag')
			syncTimeoutRef.current = null
		}, 1000)
	}, [])

	// --- Effects ---
	useEffect(() => {
		const handleClickOutside = () => setSelectedBookmark(null)
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
			if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current)
		}
	}, [])

	// --- Handlers ---
	const handleMenuClick = useCallback(
		(e: React.MouseEvent<Element, MouseEvent>, bookmark: Bookmark) => {
			e.preventDefault()
			if (isManageable(bookmark)) {
				setSelectedBookmark(bookmark)
				const rect = e.currentTarget.getBoundingClientRect()
				setContextMenuPos({ x: rect.left - 110, y: rect.bottom + 5 })
			}
		},
		[]
	)

	const handleEditBookmark = useCallback((bookmark: Bookmark) => {
		if (bookmark.type === 'FOLDER' && bookmark.password) {
			setFolderPassword(bookmark.password ?? '')
			setPendingEditBookmark(bookmark)
			setIsPasswordForEdit(true)
			setModals((m) => ({ ...m, folderPassword: true }))
			setSelectedBookmark(null)
			return
		}
		setBookmarkToEdit(bookmark)
		setModals((m) => ({ ...m, edit: true }))
		setSelectedBookmark(null)
	}, [])

	const handleOpenFolder = useCallback(
		(bookmark: Bookmark, e?: React.MouseEvent<any>) => {
			if (e?.ctrlKey || e?.metaKey) {
				openBookmarks(bookmark)
			} else {
				setCurrentFolderId(bookmark.id)
				setFolderPath((prev) => [
					...prev,
					{
						id: bookmark.id,
						title: bookmark.title,
						password: bookmark.password,
					},
				])
				setCurrentFolderIsManageable(isManageable(bookmark))
			}
		},
		[isManageable]
	)

	const handleBookmarkClick = useCallback(
		(bookmark: Bookmark, e?: React.MouseEvent<Element, MouseEvent>) => {
			if (e) e.preventDefault()
			if (e?.button === 2) return
			if (e?.button === 1) {
				if (bookmark.type === 'FOLDER') openBookmarks(bookmark)
				else {
					e.preventDefault()
					window.open(bookmark.url)
				}
				return
			}
			if (bookmark.type === 'FOLDER') {
				setFolderPassword(bookmark.password ?? '')
				if (bookmark.password) {
					setFolderToOpen(bookmark)
					setModals((m) => ({ ...m, folderPassword: true }))
				} else {
					handleOpenFolder(bookmark, e)
				}
			} else {
				if (e?.ctrlKey || e?.metaKey) window.open(bookmark.url)
				else window.location.href = bookmark.url
			}
		},
		[handleOpenFolder]
	)

	const handleDragStart = useCallback(
		(e: React.DragEvent<HTMLDivElement>, bookmarkId: string) => {
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
		},
		[bookmarks, isManageable]
	)

	const handleDragOver = useCallback(
		(e: React.DragEvent<HTMLDivElement>, index: number) => {
			e.preventDefault()
			e.dataTransfer.dropEffect = 'move'
			setDragOverIndex(index)
		},
		[]
	)

	const handleDragEnd = useCallback(() => {
		setDraggedBookmarkId(null)
		setDragOverIndex(null)
	}, [])

	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
			e.preventDefault()
			if (!draggedBookmarkId) return
			const currentItems = getCurrentFolderItems(currentFolderId)
			const sourceIndex = currentItems.findIndex(
				(item) => item.id === draggedBookmarkId
			)
			if (sourceIndex === -1 || sourceIndex === targetIndex) {
				setDraggedBookmarkId(null)
				setDragOverIndex(null)
				return
			}
			const allBookmarks = [...bookmarks]
			const sourceBookmark = currentItems[sourceIndex]
			const actualSourceIndex = allBookmarks.findIndex(
				(b) => b.id === sourceBookmark.id
			)
			const targetBookmark = currentItems[targetIndex]
			const actualTargetIndex = allBookmarks.findIndex(
				(b) => b.id === targetBookmark.id
			)
			if (actualSourceIndex !== -1 && actualTargetIndex !== -1) {
				const [movedBookmark] = allBookmarks.splice(actualSourceIndex, 1)
				allBookmarks.splice(actualTargetIndex, 0, movedBookmark)
				const updatedBookmarks = allBookmarks.map((bookmark) => {
					if (bookmark.parentId === currentFolderId) {
						const newIndex = allBookmarks.findIndex(
							(b) => b.id === bookmark.id
						)
						return { ...bookmark, order: newIndex }
					}
					return bookmark
				})
				setBookmarks(updatedBookmarks)
				debouncedSync()
			}
			setDraggedBookmarkId(null)
			setDragOverIndex(null)
		},
		[
			draggedBookmarkId,
			bookmarks,
			getCurrentFolderItems,
			currentFolderId,
			setBookmarks,
			debouncedSync,
		]
	)

	const handleNavigate = useCallback(
		(folderId: string | null, depth: number) => {
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
				if (folder) setCurrentFolderIsManageable(isManageable(folder))
			} else {
				setCurrentFolderIsManageable(true)
			}
		},
		[folderPath, bookmarks, isManageable]
	)

	function openBookmarks(bookmark: Bookmark) {
		const children = getCurrentFolderItems(bookmark.id)
		const bookmarks = children.filter((b) => b.type === 'BOOKMARK')
		for (const b of bookmarks) window.open(b.url)
	}

	async function onOpenInNewTab(bookmark: Bookmark) {
		if (bookmark?.type === 'FOLDER') openBookmarks(bookmark)
		if (bookmark && bookmark.type === 'BOOKMARK') window.open(bookmark.url)
		setSelectedBookmark(null)
	}

	// --- Derived values ---
	const currentFolderItems = getCurrentFolderItems(currentFolderId)
	const displayedBookmarks = useMemo(() => {
		return currentFolderItems
			.slice(0, TOTAL_BOOKMARKS)
			.concat(
				new Array(
					Math.max(
						0,
						TOTAL_BOOKMARKS -
							currentFolderItems.length -
							(currentFolderIsManageable ? 1 : 0)
					)
				).fill(null)
			)
			.concat(
				//@ts-ignore
				currentFolderIsManageable && currentFolderItems.length < TOTAL_BOOKMARKS
					? [null]
					: []
			)
			.slice(0, TOTAL_BOOKMARKS)
	}, [currentFolderItems, TOTAL_BOOKMARKS, currentFolderIsManageable])

	// --- Render ---
	return (
		<>
			<BookmarkGrid
				displayedBookmarks={displayedBookmarks}
				dragOverIndex={dragOverIndex}
				draggedBookmarkId={draggedBookmarkId}
				isManageable={isManageable}
				handleBookmarkClick={handleBookmarkClick}
				handleMenuClick={handleMenuClick}
				handleDragStart={handleDragStart}
				handleDragOver={handleDragOver}
				handleDragEnd={handleDragEnd}
				handleDrop={handleDrop}
				setShowAddBookmarkModal={(show) =>
					setModals((m) => ({ ...m, add: show }))
				}
				currentFolderIsManageable={currentFolderIsManageable}
			/>
			{selectedBookmark && (
				<BookmarkContextMenu
					position={contextMenuPos}
					onDelete={() => {
						deleteBookmark(selectedBookmark.id)
						setSelectedBookmark(null)
					}}
					onEdit={() => handleEditBookmark(selectedBookmark)}
					onOpenInNewTab={() => onOpenInNewTab(selectedBookmark)}
				/>
			)}
			<div className="mt-2 flex justify-center w-full">
				<FolderPath folderPath={folderPath} onNavigate={handleNavigate} />
			</div>
			<FolderPasswordModal
				onConfirm={() => {
					if (isPasswordForEdit && pendingEditBookmark) {
						setBookmarkToEdit(pendingEditBookmark)
						setModals((m) => ({ ...m, edit: true, folderPassword: false }))
						setPendingEditBookmark(null)
						setIsPasswordForEdit(false)
					} else if (folderToOpen) {
						handleOpenFolder(folderToOpen)
						setModals((m) => ({ ...m, folderPassword: false }))
					}
				}}
				folderPassword={folderPassword}
				isOpen={modals.folderPassword}
				onClose={() => {
					setModals((m) => ({ ...m, folderPassword: false }))
					setPendingEditBookmark(null)
					setIsPasswordForEdit(false)
				}}
			/>
			<AddBookmarkModal
				isOpen={modals.add}
				onClose={() => setModals((m) => ({ ...m, add: false }))}
				onAdd={(bookmark) => addBookmark(bookmark)}
				parentId={currentFolderId}
			/>
			{bookmarkToEdit && (
				<EditBookmarkModal
					isOpen={modals.edit}
					onClose={() => setModals((m) => ({ ...m, edit: false }))}
					onSave={(bookmark) => editBookmark(bookmark)}
					bookmark={bookmarkToEdit}
				/>
			)}
		</>
	)
}
