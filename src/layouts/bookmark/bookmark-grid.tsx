import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { useIsMutating } from '@tanstack/react-query'
import Analytics from '@/analytics'
import { ConfirmationModal } from '@/components/modal/confirmation-modal'
import { useBookmarkStore } from '@/context/bookmark.context'
import { useGeneralSetting } from '@/context/general-setting.context'
import type { Bookmark, FolderPathItem } from './types/bookmark.types'
import { openBookmarksOptimized } from './utils/tabManager'
import { EmptyBookmarkSlot } from './components/bookmark-emptySlot'
import { BookmarkContextMenu } from './components/modal/bookmark-context-menu'
import { EditBookmarkModal } from './components/modal/edit-bookmark.modal'
import { SortableBookmarkItem } from './components/sortable-bookmark-item'

interface BookmarkGridProps {
	displayedBookmarks: Bookmark[]
	openAddBookmarkModal: () => void
	folderPath: FolderPathItem[]
	setCurrentFolderId: (id: string | null) => void
	setFolderPath: (path: FolderPathItem[]) => void
}

export function BookmarkGrid({
	displayedBookmarks,
	openAddBookmarkModal,
	setCurrentFolderId,
	setFolderPath,
	folderPath,
}: BookmarkGridProps) {
	const { getCurrentFolderItems, editBookmark, deleteBookmark } = useBookmarkStore()
	const { browserTabsEnabled } = useGeneralSetting()

	const [showEditBookmarkModal, setShowEditBookmarkModal] = useState(false)
	const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false)
	const [bookmarkToEdit, setBookmarkToEdit] = useState<Bookmark | null>(null)
	const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(null)
	const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })
	const [bookmarkToDelete, setBookmarkToDelete] = useState<Bookmark | null>(null)

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

	const handleMenuClick = (e: React.MouseEvent<HTMLElement>, bookmark: Bookmark) => {
		e.preventDefault()
		setSelectedBookmark(bookmark)
		const button = e.currentTarget
		if (button) {
			const rect = button.getBoundingClientRect()
			setContextMenuPos({ x: rect.left - 110, y: rect.bottom + 5 })
		}
	}

	const openBookmarks = (bookmark: Bookmark) => {
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
			deleteBookmark(bookmarkToDelete.onlineId || bookmarkToDelete.id)
		}
	}

	const handleCancelDelete = () => {
		setBookmarkToDelete(null)
		setShowDeleteConfirmationModal(false)
	}

	const onOpenInNewTab = (bookmark: Bookmark) => {
		if (bookmark?.type === 'FOLDER') {
			openBookmarks(bookmark)
		}

		if (bookmark && bookmark.type === 'BOOKMARK') {
			window.open(bookmark.url)
			Analytics.event('open_bookmark_in_new_tab')
		}

		setSelectedBookmark(null)
	}

	const isRemoving = useIsMutating({ mutationKey: ['removeBookmark'] }) > 0

	useEffect(() => {
		if (!isRemoving) {
			setBookmarkToDelete(null)
			setShowDeleteConfirmationModal(false)
		}
	}, [isRemoving])

	useEffect(() => {
		const handleClickOutside = () => setSelectedBookmark(null)
		document.addEventListener('click', handleClickOutside)

		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	}, [])

	return (
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
								onClick={(e) => handleBookmarkClick(bookmark, e)}
								onMenuClick={(e) => handleMenuClick(e, bookmark)}
								id={bookmark.id}
							/>
						</div>
					) : (
						<EmptyBookmarkSlot
							key={i}
							canAdd={true}
							onClick={openAddBookmarkModal}
						/>
					)
				)}
			</SortableContext>

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
				confirmText={isRemoving ? 'در حال حذف...' : 'حذف'}
				cancelText="انصراف"
				variant="danger"
				isLoading={isRemoving}
				direction="rtl"
			/>
			{selectedBookmark && (
				<BookmarkContextMenu
					position={contextMenuPos}
					onDelete={() => handleDeleteBookmark(selectedBookmark)}
					onEdit={() => handleEditBookmark(selectedBookmark)}
					onOpenInNewTab={() => onOpenInNewTab(selectedBookmark)}
				/>
			)}
		</div>
	)
}
