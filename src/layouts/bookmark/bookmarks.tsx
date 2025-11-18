import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core'
import { useCallback, useRef, useState } from 'react'
import Analytics from '@/analytics'
import { callEvent } from '@/common/utils/call-event'
import { useBookmarkStore } from '@/context/bookmark.context'
import { SyncTarget } from '@/layouts/navbar/sync/sync'
import { FolderHeader } from './components/folder-header'
import { AddBookmarkModal } from './components/modal/add-bookmark.modal'
import type { Bookmark, FolderPathItem } from './types/bookmark.types'
import { BookmarkGrid } from './components/bookmark-grid'

export function BookmarksComponent() {
	const { bookmarks, getCurrentFolderItems, addBookmark, setBookmarks } =
		useBookmarkStore()

	const [showAddBookmarkModal, setShowAddBookmarkModal] = useState(false)

	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)

	const [folderPath, setFolderPath] = useState<FolderPathItem[]>([])

	const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
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
			<AddBookmarkModal
				isOpen={showAddBookmarkModal}
				onClose={() => setShowAddBookmarkModal(false)}
				onAdd={(bookmark) => addBookmark(bookmark)}
				parentId={currentFolderId}
			/>
		</>
	)
}
