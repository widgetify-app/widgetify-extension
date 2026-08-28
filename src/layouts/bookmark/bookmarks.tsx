import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { useState } from 'react'
import Analytics from '@/analytics'
import { FolderHeader } from './components/folder-header'
import { BookmarkFolderModal } from './components/modal/bookmark-folder.modal'
import { AddBookmarkModal } from './components/modal/add-bookmark.modal'
import { ImportBrowserBookmarksModal } from './components/modal/import-browser-bookmarks.modal'
import type { Bookmark, FolderPathItem } from './types/bookmark.types'
import { BookmarkGrid } from './bookmark-grid'
import { useBookmarkStore } from './context/bookmark.context'
import { useAuth } from '@/context/auth.context'
import { AuthRequiredModal } from '@/components/auth/auth-required-modal'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { useUpdateBookmarkOrder } from '@/services/hooks/bookmark/update-bookmark-order.hook'
import { useOptionalFreeWidgets } from '@/context/free-widget.context'
import { WidgetKeys, type WidgetSize } from '../widgets/layout-engine/types'
import { validate } from 'uuid'

interface BookmarksListProps {
	size?: WidgetSize
	instanceId?: string
}

export function BookmarksList({ size, instanceId }: BookmarksListProps = {}) {
	const {
		bookmarks,
		getCurrentFolderItems,
		currentFolderId,
		addBookmark,
		setBookmarks,
	} = useBookmarkStore()
	const { isAuthenticated } = useAuth()

	const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false)
	const [showImportBookmarksModal, setShowImportBookmarksModal] = useState(false)
	const [folderModalPath, setFolderModalPath] = useState<FolderPathItem[]>([])
	const { mutateAsync: updateOrder } = useUpdateBookmarkOrder()
	const [folderPath, setFolderPath] = useState<FolderPathItem[]>([])

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		})
	)

	let colsCount = 5
	let rowsCount = 2

	if (size) {
		if (size.w === 1 && size.h === 1) {
			colsCount = 1
			rowsCount = 1
		} else if (size.w === 1) {
			colsCount = 1
			rowsCount = size.h
		} else if (size.w === 2 && size.h === 1) {
			colsCount = 2
			rowsCount = 1
		} else if (size.w === 2 && size.h === 2) {
			colsCount = 2
			rowsCount = 2
		} else if (size.w === 2 && size.h >= 3) {
			colsCount = 2
			rowsCount = 5
		} else if (size.w === 2) {
			colsCount = 2
			rowsCount = size.h
		} else if (size.w === 4 && size.h === 1) {
			colsCount = 5
			rowsCount = 1
		} else if (size.w === 4) {
			colsCount = 5
			rowsCount = size.h
		}
	}

	const TOTAL_BOOKMARKS = colsCount * rowsCount

	const handleDragEnd = async (event: DragEndEvent) => {
		if (!isAuthenticated)
			return showToast(translateError('UNAUTHORIZED') as string, 'error')

		const { active, over } = event
		if (!over || active.id === over.id) return

		const currentItems = getCurrentFolderItems(currentFolderId, instanceId)

		const sourceIndex = currentItems.findIndex(
			(item) => item.id === active.id || item.onlineId === active.id
		)
		const targetIndex = currentItems.findIndex(
			(item) => item.id === over.id || item.onlineId === over.id
		)

		if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex)
			return

		const newCurrentItems = [...currentItems]
		const [movedItem] = newCurrentItems.splice(sourceIndex, 1)
		newCurrentItems.splice(targetIndex, 0, movedItem)

		const parentBookmark = bookmarks.find(
			(b) => b.id === currentFolderId || b.onlineId === currentFolderId
		)

		const updatedBookmarks = bookmarks.map((bookmark) => {
			const isInCurrentFolder =
				bookmark.parentId === currentFolderId ||
				(parentBookmark?.id && bookmark.parentId === parentBookmark.id) ||
				(parentBookmark?.onlineId &&
					bookmark.parentId === parentBookmark.onlineId)

			if (isInCurrentFolder) {
				const newIndex = newCurrentItems.findIndex(
					(item) => item.id === bookmark.id || item.onlineId === bookmark.id
				)
				if (newIndex !== -1) {
					return { ...bookmark, order: newIndex }
				}
			}
			return bookmark
		})

		setBookmarks(updatedBookmarks)

		const itemsToReorder = updatedBookmarks.filter(
			(b) =>
				b.parentId === currentFolderId ||
				(parentBookmark?.id && b.parentId === parentBookmark.id) ||
				(parentBookmark?.onlineId && b.parentId === parentBookmark.onlineId)
		)

		let folderIdForApi = currentFolderId
		if (parentBookmark?.onlineId) {
			folderIdForApi = parentBookmark.onlineId
		}

		try {
			await updateOrder({
				folderId: folderIdForApi,
				bookmarks: itemsToReorder.map((b) => ({
					id: b.onlineId || b.id,
					order: b.order,
				})),
			})
		} catch {
			showToast('خطا در مرتب‌سازی بوکمارک‌ها', 'error')
		}

		Analytics.event('bookmark_reorder')
	}

	const handleOpenFolderInModal = (folder: Bookmark) => {
		const isValidUuid = validate(folder.id)
		const targetId = isValidUuid ? folder.id : folder.onlineId || folder.id
		setFolderModalPath([{ id: targetId, title: folder.title }])
	}

	const freeWidgetContext = useOptionalFreeWidgets()
	const isPrimary = (() => {
		if (!instanceId || instanceId === 'bookmarks-default') return true
		if (!freeWidgetContext) return true
		const bookmarkWidgets = freeWidgetContext.runtimeLayout.filter(
			(w) => w.id === WidgetKeys.bookmarks
		)
		if (bookmarkWidgets.length === 0) return true
		return bookmarkWidgets[0].instanceId === instanceId
	})()

	const currentFolderItems = getCurrentFolderItems(
		currentFolderId,
		instanceId,
		isPrimary
	)

	const getDisplayedBookmarks = (): Bookmark[] => {
		if (!currentFolderId) {
			const baseItems = currentFolderItems.slice(0, TOTAL_BOOKMARKS)
			const fillersCount = Math.max(0, TOTAL_BOOKMARKS - currentFolderItems.length)
			const fillers = new Array(fillersCount).fill(null)
			const addButton = currentFolderItems.length < TOTAL_BOOKMARKS ? [null] : []
			return [...baseItems, ...fillers, ...addButton].slice(0, TOTAL_BOOKMARKS)
		}

		const bookmarkCount = currentFolderItems.length
		const maxBookmarks = 10
		const needsFillers = bookmarkCount < maxBookmarks
		const fillersCount = needsFillers ? maxBookmarks - bookmarkCount : 0
		const folderItems = [...currentFolderItems, ...new Array(fillersCount).fill(null)]

		if (bookmarkCount >= maxBookmarks) {
			folderItems.push(null)
		}
		return folderItems
	}

	const displayedBookmarks = getDisplayedBookmarks() || []

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<div
					className={`flex bookmarks  flex-col h-full w-full transition-all duration-300`}
				>
					<div className={'h-full w-full'}>
						<BookmarkGrid
							displayedBookmarks={displayedBookmarks}
							folderPath={folderPath}
							setFolderPath={(path) => setFolderPath(path)}
							openAddBookmarkModal={() => setShowAddBookmarkModal(true)}
							onOpenFolder={handleOpenFolderInModal}
							colsCount={colsCount}
							rowsCount={rowsCount}
							isModal={Boolean(currentFolderId)}
						/>
					</div>
				</div>
			</DndContext>

			{folderModalPath.length > 0 && (
				<BookmarkFolderModal
					isOpen={folderModalPath.length > 0}
					onClose={() => setFolderModalPath([])}
					folderPath={folderModalPath}
					setFolderPath={setFolderModalPath}
					instanceId={instanceId}
					isPrimary={isPrimary}
				/>
			)}
			{showAddBookmarkModal && !isAuthenticated ? (
				<AuthRequiredModal
					isOpen={true}
					onClose={() => setShowAddBookmarkModal(false)}
					message="برای افزودن بوکمارک جدید باید وارد حساب کاربری خود شوید."
					loginButtonText="ورود به حساب کاربری"
				/>
			) : (
				showAddBookmarkModal && (
					<AddBookmarkModal
						isOpen={showAddBookmarkModal}
						onClose={() => setShowAddBookmarkModal(false)}
						onAdd={(bookmark) =>
							addBookmark(bookmark, () => setShowAddBookmarkModal(false))
						}
						parentId={currentFolderId}
						widgetId={instanceId}
						onOpenImport={() => {
							setShowAddBookmarkModal(false)
							setShowImportBookmarksModal(true)
						}}
					/>
				)
			)}
			{showImportBookmarksModal && (
				<ImportBrowserBookmarksModal
					isOpen={showImportBookmarksModal}
					onClose={() => setShowImportBookmarksModal(false)}
					parentId={currentFolderId}
				/>
			)}
		</>
	)
}
