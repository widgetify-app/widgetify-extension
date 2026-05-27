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
import { AddBookmarkModal } from './components/modal/add-bookmark.modal'
import type { Bookmark, FolderPathItem } from './types/bookmark.types'
import { BookmarkGrid } from './bookmark-grid'
import { useBookmarkStore } from './context/bookmark.context'
import { useAuth } from '@/context/auth.context'
import { AuthRequiredModal } from '@/components/auth/AuthRequiredModal'
import { showToast } from '@/common/toast'
import { useUpdateBookmarkOrder } from '@/services/hooks/bookmark/update-bookmark-order.hook'

export function BookmarksList() {
	const {
		bookmarks,
		getCurrentFolderItems,
		currentFolderId,
		setCurrentFolderId,
		addBookmark,
		setBookmarks,
	} = useBookmarkStore()
	const { isAuthenticated } = useAuth()

	const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false)
	const { mutateAsync: updateOrder } = useUpdateBookmarkOrder()
	const [folderPath, setFolderPath] = useState<FolderPathItem[]>([])

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		})
	)
	const BOOKMARKS_PER_ROW = 5
	const TOTAL_BOOKMARKS = BOOKMARKS_PER_ROW * 2

	const handleDragEnd = async (event: DragEndEvent) => {
		if (!isAuthenticated)
			return showToast(
				'برای مرتب‌سازی بوکمارک‌ها باید وارد حساب کاربری خود شوید.',
				'error'
			)

		const { active, over } = event
		if (!over || active.id === over.id) return

		const currentItems = getCurrentFolderItems(currentFolderId)

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

	const handleNavigate = (folderId: string | null, depth: number) => {
		if (depth === -1) {
			setFolderPath([])
			setCurrentFolderId(null)
			return
		}
		const newPath = folderPath.slice(0, depth + 1)
		setFolderPath(newPath)
		setCurrentFolderId(folderId)
	}

	const currentFolderItems = getCurrentFolderItems(currentFolderId)

	const getDisplayedBookmarks = (): Bookmark[] => {
		const baseItems = currentFolderItems.slice(0, TOTAL_BOOKMARKS)
		const fillersCount = Math.max(0, TOTAL_BOOKMARKS - currentFolderItems.length)
		const fillers = new Array(fillersCount).fill(null)
		const addButton = currentFolderItems.length < TOTAL_BOOKMARKS ? [null] : []
		return [...baseItems, ...fillers, ...addButton].slice(0, TOTAL_BOOKMARKS)
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
					className={`flex flex-col transition-all duration-300 ${
						currentFolderId
							? 'bg-content  rounded-2xl shadow-2xl overflow-hidden p-1'
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
						className={currentFolderId ? 'max-h-60 overflow-y-auto py-1' : ''}
					>
						<BookmarkGrid
							displayedBookmarks={displayedBookmarks}
							folderPath={folderPath}
							setFolderPath={(path) => setFolderPath(path)}
							openAddBookmarkModal={() => setShowAddBookmarkModal(true)}
						/>
					</div>
				</div>
			</DndContext>
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
					/>
				)
			)}
		</>
	)
}
