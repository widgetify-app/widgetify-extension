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
import { Modal } from '@/components/ui'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'
import { useAuth } from '@/context/auth.context'
import { AuthRequiredModal } from '@/components/auth/auth-required-modal'
import { useBookmarkStore } from '../../context/bookmark.context'
import { useUpdateBookmarkOrder } from '@/services/hooks/bookmark/update-bookmark-order.hook'
import type { Bookmark, FolderPathItem } from '../../types/bookmark.types'
import { BookmarkGrid } from '../../bookmark-grid'
import { FolderPath } from '../folder-path'
import { AddBookmarkModal } from './add-bookmark.modal'
import { ImportBrowserBookmarksModal } from './import-browser-bookmarks.modal'
import { validate } from 'uuid'

interface BookmarkFolderModalProps {
	isOpen: boolean
	onClose: () => void
	folderPath: FolderPathItem[]
	setFolderPath: (path: FolderPathItem[]) => void
	instanceId?: string
	isPrimary?: boolean
}

export function BookmarkFolderModal({
	isOpen,
	onClose,
	folderPath,
	setFolderPath,
	instanceId,
	isPrimary = true,
}: BookmarkFolderModalProps) {
	const { bookmarks, getCurrentFolderItems, addBookmark, setBookmarks } =
		useBookmarkStore()
	const { isAuthenticated } = useAuth()
	const { mutateAsync: updateOrder } = useUpdateBookmarkOrder()

	const [showAddModal, setShowAddModal] = useState(false)
	const [showImportModal, setShowImportModal] = useState(false)

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		})
	)

	const currentFolder = folderPath[folderPath.length - 1]
	const currentFolderId = currentFolder
		? validate(currentFolder.id)
			? currentFolder.id
			: currentFolder.id
		: null

	const currentItems = currentFolderId
		? getCurrentFolderItems(currentFolderId, instanceId, isPrimary)
		: []

	const handleNavigate = (folderId: string | null, depth: number) => {
		if (depth === -1 || !folderId) {
			onClose()
			return
		}
		const newPath = folderPath.slice(0, depth + 1)
		setFolderPath(newPath)
	}

	const handleOpenSubFolder = (folder: Bookmark) => {
		const isValidUuid = validate(folder.id)
		const targetId = isValidUuid ? folder.id : folder.onlineId || folder.id
		setFolderPath([...folderPath, { id: targetId, title: folder.title }])
	}

	const handleDragEnd = async (event: DragEndEvent) => {
		if (!isAuthenticated) {
			return showToast(translateError('UNAUTHORIZED') as string, 'error')
		}

		const { active, over } = event
		if (!over || active.id === over.id || !currentFolderId) return

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

	const getDisplayedBookmarks = (): Bookmark[] => {
		const bookmarkCount = currentItems.length
		const minSlots = 10
		const needsFillers = bookmarkCount < minSlots
		const fillersCount = needsFillers ? minSlots - bookmarkCount : 0
		const folderItems = [...currentItems, ...new Array(fillersCount).fill(null)]

		if (bookmarkCount >= minSlots) {
			folderItems.push(null)
		}
		return folderItems
	}

	const displayedBookmarks = getDisplayedBookmarks()

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={
				<div className="flex items-center gap-2">
					<span className="text-xl">📁</span>
					<span className="max-w-xs text-sm font-bold truncate text-content">
						{currentFolder?.title || 'پوشه بوکمارک'}
					</span>
				</div>
			}
			size="md"
			className="max-w-xl min-h-95 md:min-h-100 h-95 md:h-100 flex flex-col [&>div:last-child]:flex-1 [&>div:last-child]:min-h-0 [&>div:last-child]:flex [&>div:last-child]:flex-col"
			direction="rtl"
			closeOnBackdropClick={true}
		>
			<div className="flex flex-col flex-1 h-full min-h-0 gap-3 p-1 select-none">
				{folderPath.length > 1 && (
					<div className="pb-2 border-b border-base-content/10 shrink-0">
						<FolderPath folderPath={folderPath} onNavigate={handleNavigate} />
					</div>
				)}

				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<div className="flex-1 h-full min-h-0 py-1 -mx-1 overflow-y-auto pl-0.5">
						<BookmarkGrid
							displayedBookmarks={displayedBookmarks}
							folderPath={folderPath}
							setFolderPath={setFolderPath}
							openAddBookmarkModal={() => setShowAddModal(true)}
							onOpenFolder={handleOpenSubFolder}
							colsCount={5}
							isModal={true}
						/>
					</div>
				</DndContext>
			</div>

			{showAddModal && !isAuthenticated ? (
				<AuthRequiredModal
					isOpen={true}
					onClose={() => setShowAddModal(false)}
					message="برای افزودن بوکمارک جدید اول وارد حسابت شو"
				/>
			) : (
				showAddModal && (
					<AddBookmarkModal
						isOpen={showAddModal}
						onClose={() => setShowAddModal(false)}
						onAdd={(bookmark) =>
							addBookmark(bookmark, () => setShowAddModal(false))
						}
						parentId={currentFolderId}
						widgetId={instanceId}
						onOpenImport={() => {
							setShowAddModal(false)
							setShowImportModal(true)
						}}
					/>
				)
			)}

			<ImportBrowserBookmarksModal
				isOpen={showImportModal}
				onClose={() => setShowImportModal(false)}
				parentId={currentFolderId}
			/>
		</Modal>
	)
}
