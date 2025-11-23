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
import { validate } from 'uuid'

export function BookmarksList() {
	const { bookmarks, getCurrentFolderItems, addBookmark, setBookmarks } =
		useBookmarkStore()
	const { isAuthenticated } = useAuth()

	const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false)

	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)

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
		const { active, over } = event

		if (!over || active.id === over.id) {
			return
		}

		const allBookmarks = [...bookmarks]
		const currentItems = getCurrentFolderItems(currentFolderId)

		const sourceBookmark = allBookmarks.find(
			(b) => b.id === active.id || b.onlineId === active.id
		)

		if (!sourceBookmark) {
			return
		}

		const sourceIndex = currentItems.findIndex(
			(item) => item.id === active.id || item.onlineId === active.id
		)
		const targetIndex = currentItems.findIndex(
			(item) => item.id === over.id || item.onlineId === over.id
		)

		if (sourceIndex === -1 || sourceIndex === targetIndex) {
			return
		}

		const actualSourceIndex = allBookmarks.findIndex(
			(b) =>
				b.id === currentItems[sourceIndex].id ||
				b.onlineId === currentItems[sourceIndex].id
		)

		const actualTargetIndex = allBookmarks.findIndex(
			(b) =>
				b.id === currentItems[targetIndex].id ||
				b.onlineId === currentItems[targetIndex].id
		)

		if (actualSourceIndex !== -1 && actualTargetIndex !== -1) {
			const [movedBookmark] = allBookmarks.splice(actualSourceIndex, 1)
			allBookmarks.splice(actualTargetIndex, 0, movedBookmark)

			const updatedBookmarks = allBookmarks.map((bookmark) => {
				if (bookmark.parentId === currentFolderId) {
					const newIndex = allBookmarks.findIndex(
						(b) =>
							b.id === bookmark.id ||
							b.onlineId === bookmark.id ||
							b.onlineId === bookmark.onlineId
					)
					return { ...bookmark, order: newIndex }
				}
				return bookmark
			})

			setBookmarks(updatedBookmarks)
			if (isAuthenticated) {
				let folderIdToSend = currentFolderId

				const isFolderIdValidUuid = validate(currentFolderId)
				if (isFolderIdValidUuid) {
					const foundedFolder = bookmarks.find((b) => b.id === currentFolderId)
					if (foundedFolder) {
						folderIdToSend = foundedFolder.onlineId || currentFolderId
					}
				}

				browser.runtime.sendMessage({
					type: 'REORDER',
					folderId: folderIdToSend,
					bookmarks: updatedBookmarks
						.filter((b) => b.parentId === currentFolderId)
						.map((b) => ({
							id: b.onlineId || b.id,
							order: b.order,
						})),
				})
			}

			Analytics.event('bookmark_reorder')
		}
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
		if (!currentFolderId) {
			const baseItems = currentFolderItems.slice(0, TOTAL_BOOKMARKS)
			const fillersCount = Math.max(0, TOTAL_BOOKMARKS - currentFolderItems.length)
			const fillers = new Array(fillersCount).fill(null)
			const addButton = currentFolderItems.length < TOTAL_BOOKMARKS ? [null] : []

			return [...baseItems, ...fillers, ...addButton].slice(0, TOTAL_BOOKMARKS)
		}

		const bookmarkCount = currentFolderItems.length
		const minBookmarks = 10
		const needsFillers = bookmarkCount < minBookmarks
		const fillersCount = needsFillers ? minBookmarks - bookmarkCount : 0

		return [...currentFolderItems, ...new Array(fillersCount).fill(null), null]
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
							? 'bg-widget widget-wrapper max-h-60 overflow-y-auto py-1 rounded-2xl'
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

					<BookmarkGrid
						displayedBookmarks={displayedBookmarks}
						folderPath={folderPath}
						setCurrentFolderId={(id) => setCurrentFolderId(id)}
						setFolderPath={(path) => setFolderPath(path)}
						openAddBookmarkModal={() => setShowAddBookmarkModal(true)}
					/>
				</div>
			</DndContext>
			{showAddBookmarkModal && (
				<AddBookmarkModal
					isOpen={showAddBookmarkModal}
					onClose={() => setShowAddBookmarkModal(false)}
					onAdd={(bookmark) =>
						addBookmark(bookmark, () => setShowAddBookmarkModal(false))
					}
					parentId={currentFolderId}
				/>
			)}
		</>
	)
}
