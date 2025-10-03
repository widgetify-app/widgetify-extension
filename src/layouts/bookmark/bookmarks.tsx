import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { useCallback, useEffect, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { ConfirmationModal } from '@/components/modal/confirmation-modal'
import { useBookmarkStore } from '@/context/bookmark.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import { SyncTarget } from '@/layouts/navbar/sync/sync'
import { BookmarkItem } from './components/bookmark-item'
import { FolderHeader } from './components/folder-header'
import { AddBookmarkModal } from './components/modal/add-bookmark.modal'
import { BookmarkContextMenu } from './components/modal/bookmark-context-menu'
import { EditBookmarkModal } from './components/modal/edit-bookmark.modal'
import { SortableBookmarkItem } from './components/sortable-bookmark-item'
import type { Bookmark, FolderPathItem } from './types/bookmark.types'
import { openBookmarksOptimized } from './utils/tabManager'

export function BookmarksComponent() {
	const {
		bookmarks,
		getCurrentFolderItems,
		addBookmark,
		editBookmark,
		deleteBookmark,
		setBookmarks,
	} = useBookmarkStore()
	const { browserTabsEnabled } = useGeneralSetting()

	const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false)
	const [showEditBookmarkModal, setShowEditBookmarkModal] = useState(false)
	const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
	const [bookmarkToEdit, setBookmarkToEdit] = useState<Bookmark | null>(null)
	const [bookmarkToDelete, setBookmarkToDelete] = useState<Bookmark | null>(null)

	const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)

	const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })

	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)

	const [folderPath, setFolderPath] = useState<FolderPathItem[]>([])

	const [currentFolderIsManageable, setCurrentFolderIsManageable] =
		useState<boolean>(true)

	const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5, // 5px movement required before drag starts
			},
		})
	)

	const BOOKMARKS_PER_ROW = 5
	const TOTAL_BOOKMARKS = BOOKMARKS_PER_ROW * 2

	const debouncedSync = useCallback(() => {
		if (syncTimeoutRef.current) {
			clearTimeout(syncTimeoutRef.current)
		}

		syncTimeoutRef.current = setTimeout(() => {
			callEvent('startSync', SyncTarget.BOOKMARKS)
			Analytics.event('drag_and_drop_bookmark', {})
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

	const handleDeleteBookmark = (bookmark: Bookmark) => {
		setBookmarkToDelete(bookmark)
		setShowDeleteConfirmationModal(true)
		setSelectedBookmark(null)
	}

	const handleConfirmDelete = () => {
		if (bookmarkToDelete) {
			deleteBookmark(bookmarkToDelete.id)
			setBookmarkToDelete(null)
		}
		setShowDeleteConfirmationModal(false)
	}

	const handleCancelDelete = () => {
		setBookmarkToDelete(null)
		setShowDeleteConfirmationModal(false)
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
				e.preventDefault()
				Analytics.event('open_bookmark_middle_mouse')
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
				Analytics.event('open_bookmark_in_new_tab')
			} else {
				window.location.href = bookmark.url
				Analytics.event('open_bookmark_in_current_tab')
			}
		}
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (!over || active.id === over.id) {
			return
		}

		const allBookmarks = [...bookmarks]
		const currentItems = getCurrentFolderItems(currentFolderId)

		const sourceBookmark = allBookmarks.find((b) => b.id === active.id)

		if (!sourceBookmark) {
			return
		}

		const sourceIndex = currentItems.findIndex((item) => item.id === active.id)
		const targetIndex = currentItems.findIndex((item) => item.id === over.id)

		if (sourceIndex === -1 || sourceIndex === targetIndex) {
			return
		}

		const actualSourceIndex = allBookmarks.findIndex(
			(b) => b.id === currentItems[sourceIndex].id
		)

		const actualTargetIndex = allBookmarks.findIndex(
			(b) => b.id === currentItems[targetIndex].id
		)

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
		if (bookmarks.length === 0) return

		if (!browserTabsEnabled || !browser.tabGroups || !browser.tabs) {
			for (const b of bookmarks) {
				window.open(b.url)
			}

			Analytics.event('open_folder_bookmarks')
		} else {
			openBookmarksOptimized(bookmark, children)
			Analytics.event('open_folder_bookmarks_grouped')
		}
	}

	async function onOpenInNewTab(bookmark: Bookmark) {
		if (bookmark?.type === 'FOLDER') {
			openBookmarks(bookmark)
		}

		if (bookmark && bookmark.type === 'BOOKMARK') {
			window.open(bookmark.url)
			Analytics.event('open_bookmark_in_new_tab')
		}

		setSelectedBookmark(null)
	}

	function openAddBookmarkModal() {
		setShowAddBookmarkModal(true)
		Analytics.event('open_add_bookmark_modal')
	}

	const currentFolderItems = getCurrentFolderItems(currentFolderId)

	const getDisplayedBookmarks = (): (Bookmark | null)[] => {
		if (!currentFolderId) {
			const baseItems = currentFolderItems.slice(0, TOTAL_BOOKMARKS)
			const fillersCount = Math.max(
				0,
				TOTAL_BOOKMARKS -
					currentFolderItems.length -
					(currentFolderIsManageable ? 1 : 0)
			)
			const fillers = new Array(fillersCount).fill(null)
			const addButton =
				currentFolderIsManageable && currentFolderItems.length < TOTAL_BOOKMARKS
					? [null]
					: []

			return [...baseItems, ...fillers, ...addButton].slice(0, TOTAL_BOOKMARKS)
		}

		if (!currentFolderIsManageable) {
			const minItems = Math.max(currentFolderItems.length, 10)
			const fillersCount = minItems - currentFolderItems.length
			return [...currentFolderItems, ...new Array(fillersCount).fill(null)]
		}

		const bookmarkCount = currentFolderItems.length
		const minBookmarks = 9
		const needsFillers = bookmarkCount < minBookmarks
		const fillersCount = needsFillers ? minBookmarks - bookmarkCount : 0

		return [...currentFolderItems, ...new Array(fillersCount).fill(null), null]
	}

	const displayedBookmarks = getDisplayedBookmarks()

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<div
					className={`flex flex-col ${
						currentFolderId
							? 'bg-widget widget-wrapper max-h-56 overflow-y-auto py-0.5 rounded-2xl'
							: ''
					}`}
					id="bookmarks"
				>
					{currentFolderId && (
						<FolderHeader
							folderPath={folderPath}
							onNavigate={handleNavigate}
						/>
					)}

					<div
						className={`grid w-full grid-cols-5 gap-4 transition-all duration-300 rounded-2xl lg:gap-2 lg:px-1`}
					>
						<SortableContext
							items={displayedBookmarks
								.filter(Boolean)
								.map((bookmark) => bookmark?.id || '')}
							strategy={rectSortingStrategy}
						>
							{displayedBookmarks.map((bookmark, i) =>
								bookmark ? (
									<div
										key={bookmark.id}
										className="transition-transform duration-200"
									>
										<SortableBookmarkItem
											bookmark={bookmark}
											onClick={(e) =>
												handleBookmarkClick(bookmark, e)
											}
											onMenuClick={(e) =>
												handleMenuClick(e, bookmark)
											}
											isManageable={isManageable(bookmark)}
											id={bookmark.id}
										/>
									</div>
								) : (
									<BookmarkItem
										key={i}
										bookmark={null}
										onClick={openAddBookmarkModal}
										canAdd={currentFolderIsManageable}
									/>
								)
							)}
						</SortableContext>
					</div>
				</div>
			</DndContext>
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
			<ConfirmationModal
				isOpen={showDeleteConfirmationModal}
				onClose={handleCancelDelete}
				onConfirm={handleConfirmDelete}
				title="حذف بوکمارک"
				message={
					bookmarkToDelete?.type === 'FOLDER' ? (
						<div>
							<p>
								آیا از حذف پوشه "{bookmarkToDelete.title}" اطمینان دارید؟
							</p>
							<p className="mt-2 text-xs text-error">
								تمام بوکمارک‌های داخل این پوشه نیز حذف خواهند شد.
							</p>
						</div>
					) : (
						<p>
							آیا از حذف بوکمارک "{bookmarkToDelete?.title}" اطمینان دارید؟
						</p>
					)
				}
				confirmText="حذف"
				cancelText="انصراف"
				variant="danger"
				direction="ltr"
			/>
			{selectedBookmark && (
				<BookmarkContextMenu
					position={contextMenuPos}
					onDelete={() => handleDeleteBookmark(selectedBookmark)}
					onEdit={() => handleEditBookmark(selectedBookmark)}
					onOpenInNewTab={() => onOpenInNewTab(selectedBookmark)}
				/>
			)}
		</>
	)
}
