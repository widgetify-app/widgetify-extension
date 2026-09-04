import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable'
import { useIsMutating } from '@tanstack/react-query'
import Analytics from '@/analytics'
import { ConfirmationModal } from '@/components/ui'
import { useGeneralSetting } from '@/context/general-setting.context'
import type { Bookmark, FolderPathItem } from './types/bookmark.types'
import { openBookmarksOptimized } from './utils/tab-manager'
import { EmptyBookmarkSlot } from './components/bookmark-empty-slot'
import { BookmarkContextMenu } from './components/modal/bookmark-context-menu'
import { EditBookmarkModal } from './components/modal/edit-bookmark.modal'
import { SortableBookmarkItem } from './components/sortable-bookmark-item'
import { useBookmarkStore } from './context/bookmark.context'
import { validate } from 'uuid'
import { useAuth } from '@/context/auth.context'
import { AuthRequiredModal } from '@/components/auth/auth-required-modal'
import { showToast } from '@/common/toast'
import { translateError } from '@/common/utils/translate-error'

interface BookmarkGridProps {
	displayedBookmarks: Bookmark[]
	openAddBookmarkModal: () => void
	folderPath: FolderPathItem[]
	setFolderPath: (path: FolderPathItem[]) => void
	colsCount?: number
	rowsCount?: number
	onOpenFolder?: (folder: Bookmark) => void
	isModal?: boolean
}

export function BookmarkGrid({
	displayedBookmarks,
	openAddBookmarkModal,
	setFolderPath,
	folderPath,
	colsCount = 5,
	rowsCount = 2,
	onOpenFolder,
	isModal = false,
}: BookmarkGridProps) {
	const { getCurrentFolderItems, editBookmark, deleteBookmark, setCurrentFolderId } =
		useBookmarkStore()
	const { browserTabsEnabled } = useGeneralSetting()
	const { isAuthenticated } = useAuth()

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
				if (bookmark.url) window.open(bookmark.url)
			}
			return
		}

		if (bookmark.type === 'FOLDER') {
			if (e?.ctrlKey || e?.metaKey) {
				openBookmarks(bookmark)
			} else if (onOpenFolder) {
				onOpenFolder(bookmark)
			} else {
				const isValidUUid = validate(bookmark.id)
				setCurrentFolderId(isValidUUid ? bookmark.id : bookmark.onlineId)
				setFolderPath([...folderPath, { id: bookmark.id, title: bookmark.title }])
			}
		} else {
			if (e?.ctrlKey || e?.metaKey) {
				if (bookmark.url) {
					window.open(bookmark.url)
					Analytics.event('open_bookmark_in_new_tab')
				}
			} else {
				if (bookmark.url) {
					window.location.href = bookmark.url
					Analytics.event('open_bookmark_in_current_tab')
				}
			}
		}
	}

	const handleMenuClick = (e: React.MouseEvent<HTMLElement>, bookmark: Bookmark) => {
		e.preventDefault()
		e.stopPropagation()
		setSelectedBookmark(bookmark)

		const isContextMenu = e.type === 'contextmenu'
		let x: number
		let y: number

		if (isContextMenu && e.clientX && e.clientY) {
			x = e.clientX
			y = e.clientY
		} else {
			const target = e.currentTarget
			const rect = target.getBoundingClientRect()
			x = rect.left + rect.width / 2 - 74
			y = rect.bottom + 4
		}

		setContextMenuPos({ x, y })
	}

	const openBookmarks = (bookmark: Bookmark) => {
		const children = getCurrentFolderItems(bookmark.id)
		const bookmarks = children.filter((b) => b.type === 'BOOKMARK')
		if (bookmarks.length === 0) return

		if (!browserTabsEnabled || !browser.tabGroups || !browser.tabs) {
			for (const b of bookmarks) {
				if (b.url) {
					window.open(b.url)
				}
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
		if (!isAuthenticated) {
			return showToast(translateError('UNAUTHORIZED') as string, 'error')
		}

		setBookmarkToDelete(bookmark)
		setShowDeleteConfirmationModal(true)
		setSelectedBookmark(null)
	}

	const handleConfirmDelete = () => {
		if (bookmarkToDelete) {
			deleteBookmark(bookmarkToDelete.onlineId || bookmarkToDelete.id, () => {
				setBookmarkToDelete(null)
				setShowDeleteConfirmationModal(false)
			})
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

		if (bookmark && bookmark.type === 'BOOKMARK' && bookmark.url) {
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

	const isAutoRows = isModal || !rowsCount

	const gridColsClass =
		colsCount === 1 ? 'grid-cols-1' : colsCount === 2 ? 'grid-cols-2' : 'grid-cols-5'

	const gridRowsClass =
		rowsCount === 1
			? 'grid-rows-1'
			: rowsCount === 2
				? 'grid-rows-2'
				: rowsCount === 3
					? 'grid-rows-3'
					: ''

	return (
		<div
			style={
				isAutoRows
					? {
							gridTemplateColumns: `repeat(${colsCount}, minmax(0, 1fr))`,
						}
					: {
							gridTemplateColumns: `repeat(${colsCount}, minmax(0, 1fr))`,
							gridTemplateRows: `repeat(${rowsCount}, minmax(0, 1fr))`,
						}
			}
			className={
				isAutoRows
					? `grid w-full auto-rows-[5.5rem] sm:auto-rows-[5.75rem] ${gridColsClass} gap-2 p-0.5 transition-all duration-300 rounded-2xl`
					: `grid w-full h-full grid-flow-row ${gridColsClass} ${gridRowsClass} gap-1.5 transition-all duration-300 rounded-2xl`
			}
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
							key={bookmark.id + '-' + i}
							className="w-full h-full transition-transform duration-200"
						>
							<SortableBookmarkItem
								bookmark={bookmark}
								onClick={(e) => handleBookmarkClick(bookmark, e)}
								onMenuClick={(e) => handleMenuClick(e, bookmark)}
								id={bookmark.id}
							/>
						</div>
					) : (
						<div key={i} className="w-full h-full">
							<EmptyBookmarkSlot
								canAdd={true}
								onClick={openAddBookmarkModal}
							/>
						</div>
					)
				)}
			</SortableContext>

			{showEditBookmarkModal && bookmarkToEdit && !isAuthenticated ? (
				<AuthRequiredModal
					isOpen={true}
					onClose={() => {
						setShowEditBookmarkModal(false)
						setBookmarkToEdit(null)
					}}
					message="برای ویرایش بوکمارک اول وارد حسابت شو"
				/>
			) : (
				<EditBookmarkModal
					isOpen={showEditBookmarkModal}
					onClose={() => {
						setShowEditBookmarkModal(false)
						setBookmarkToEdit(null)
					}}
					onSave={(bookmark) =>
						editBookmark(bookmark, () => {
							setShowEditBookmarkModal(false)
							setBookmarkToEdit(null)
						})
					}
					bookmark={bookmarkToEdit}
				/>
			)}

			<ConfirmationModal
				isOpen={showDeleteConfirmationModal}
				onClose={handleCancelDelete}
				onConfirm={handleConfirmDelete}
				title="حذف بوکمارک؟"
				message={
					bookmarkToDelete?.type === 'FOLDER' ? (
						<div>
							<p>آیا از حذف پوشه "{bookmarkToDelete.title}" مطمئن هستی؟</p>
							<p className="flex gap-1 px-2 py-1 mt-2 text-xs rounded-xl bg-error/20 text-error">
								با حذف این پوشه، تمام بوکمارک‌های داخلش هم برای همیشه حذف
								میشن و این عمل قابل بازگشت نیست!
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
					onOpenInNewTab={
						selectedBookmark.type === 'BOOKMARK'
							? () => onOpenInNewTab(selectedBookmark)
							: undefined
					}
					onClose={() => setSelectedBookmark(null)}
				/>
			)}
		</div>
	)
}
