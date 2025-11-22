import { useEffect, useState } from 'react'
import { Button } from '@/components/button/button'
import Modal from '@/components/modal'
import { FiFolder, FiChevronLeft } from 'react-icons/fi'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { useGeneralSetting } from '@/context/general-setting.context'
import { useBookmarkStore } from '../../context/bookmark.context'
import {
	type FetchedBrowserBookmark,
	getBrowserBookmarks,
} from '../../utils/browser-bookmarks.util'
import { BookmarkPermissionInfoModal } from './bookmark-permission-info.modal'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'react-hot-toast'
import { setToStorage } from '@/common/storage'
import { callEvent } from '@/common/utils/call-event'
import { SyncTarget } from '@/layouts/navbar/sync/sync'
import Analytics from '@/analytics'
import type { Bookmark, LocalBookmark } from '../../types/bookmark.types'

interface ImportBookmarkModalProps {
	isOpen: boolean
	onClose: () => void
	parentId: string | null
	availableSlots: number
}

interface SelectedItem {
	id: string
	title: string
	url: string | null
	type: 'BOOKMARK' | 'FOLDER'
	children?: FetchedBrowserBookmark[]
	importChildren?: boolean
}

export function ImportBookmarkModal({
	isOpen,
	onClose,
	parentId,
	availableSlots,
}: ImportBookmarkModalProps) {
	const [browserBookmarks, setBrowserBookmarks] = useState<FetchedBrowserBookmark[]>([])
	const [loading, setLoading] = useState(false)
	const [selectedItems, setSelectedItems] = useState<Map<string, SelectedItem>>(new Map())
	const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
	const [showPermissionInfoModal, setShowPermissionInfoModal] = useState(false)
	const [isImporting, setIsImporting] = useState(false)

	const { browserBookmarksEnabled, setBrowserBookmarksEnabled } = useGeneralSetting()
	const { bookmarks: existingBookmarks, setBookmarks, getCurrentFolderItems } = useBookmarkStore()

	// Check permission when modal opens
	useEffect(() => {
		if (isOpen && !browserBookmarksEnabled) {
			browser.permissions.contains({ permissions: ['bookmarks'] }).then((hasPermission) => {
				if (!hasPermission) {
					setShowPermissionInfoModal(true)
				}
			})
		}
	}, [isOpen, browserBookmarksEnabled])

	useEffect(() => {
		async function loadBookmarks() {
			if (!browserBookmarksEnabled) return

			setLoading(true)
			try {
				const fetched = await getBrowserBookmarks({ includeFolders: true, asTree: true })
				// Filter out root folders (Bookmarks bar, Other bookmarks, etc.)
				const filtered = fetched
					.filter((root) => root.children && root.children.length > 0)
					.flatMap((root) => root.children || [])
				setBrowserBookmarks(filtered)
			} catch (error) {
				console.error('Error loading browser bookmarks:', error)
			} finally {
				setLoading(false)
			}
		}

		if (isOpen && browserBookmarksEnabled) {
			loadBookmarks()
		}
	}, [isOpen, browserBookmarksEnabled])

	const handlePermissionInfoConfirm = () => {
		browser.permissions
			.request({ permissions: ['bookmarks'] })
			.then((granted) => {
				if (granted) {
					setBrowserBookmarksEnabled(true)
					setShowPermissionInfoModal(false)
				}
			})
			.catch((error) => {
				console.error('Error requesting permission:', error)
			})
	}

	const toggleItemSelection = (item: FetchedBrowserBookmark) => {
		const newSelected = new Map(selectedItems)

		if (item.type === 'FOLDER') {
			if (newSelected.has(item.id)) {
				newSelected.delete(item.id)
			} else {
				newSelected.set(item.id, {
					id: item.id,
					title: item.title,
					url: item.url,
					type: item.type,
					children: item.children,
					importChildren: false,
				})
			}
		} else {
			if (newSelected.has(item.id)) {
				newSelected.delete(item.id)
			} else {
				if (getSelectedCount(newSelected) >= availableSlots) {
					toast.error(`فقط ${availableSlots} جایگاه خالی دارید`)
					return
				}
				newSelected.set(item.id, {
					id: item.id,
					title: item.title,
					url: item.url,
					type: item.type,
				})
			}
		}

		setSelectedItems(newSelected)
	}

	const toggleFolderExpansion = (folderId: string) => {
		const newExpanded = new Set(expandedFolders)
		if (newExpanded.has(folderId)) {
			newExpanded.delete(folderId)
		} else {
			newExpanded.add(folderId)
		}
		setExpandedFolders(newExpanded)
	}

	const toggleImportChildren = (folderId: string) => {
		const newSelected = new Map(selectedItems)
		const item = newSelected.get(folderId)
		if (item && item.type === 'FOLDER') {
			const childrenCount = item.children?.filter(c => c.type === 'BOOKMARK').length || 0
			// Check limit based on the new folder's capacity (50 slots for folders)
			const folderCapacity = 50
			const wouldExceed = !item.importChildren && (childrenCount > folderCapacity)

			if (wouldExceed) {
				toast.error(`این پوشه ${childrenCount} بوکمارک دارد که از ${folderCapacity} جایگاه مجاز بیشتر است`)
				return
			}

			newSelected.set(folderId, {
				...item,
				importChildren: !item.importChildren,
			})
			setSelectedItems(newSelected)
		}
	}

	const getSelectedCount = (selected: Map<string, SelectedItem>): number => {
		let count = 0
		selected.forEach((item) => {
			if (item.type === 'BOOKMARK') {
				count++
			} else if (item.type === 'FOLDER' && item.importChildren) {
				count += item.children?.filter(c => c.type === 'BOOKMARK').length || 0
			}
		})
		return count
	}

	const renderBookmarkItem = (item: FetchedBrowserBookmark, level: number = 0) => {
		const isSelected = selectedItems.has(item.id)
		const isExpanded = expandedFolders.has(item.id)
		const selectedItem = selectedItems.get(item.id)
		const isFolder = item.type === 'FOLDER'
		const hasChildren = item.children && item.children.length > 0

		return (
			<div key={item.id} className="w-full">
				<div
					className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/20 border border-primary' : 'hover:bg-base-300/50'
						}`}
				>
					<input
						id={item.id}
						type="checkbox"
						checked={isSelected}
						onChange={() => toggleItemSelection(item)}
						className="checkbox w-4 h-4 cursor-pointer"
						disabled={!isFolder && getSelectedCount(selectedItems) >= availableSlots && !isSelected}
					/>

					{isFolder ? (
						<button
							type="button"
							onClick={() => toggleFolderExpansion(item.id)}
							className="flex items-center gap-2 flex-1 text-right"
						>
							<FiFolder className="text-blue-400 size-5" />
							<span className="flex-1 text-sm line-clamp-1">{item.title}</span>
							{isFolder && isSelected && hasChildren && (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation()
										toggleImportChildren(item.id)
									}}
									className={`px-2 py-1 text-xs rounded transition-colors ${selectedItem?.importChildren
										? 'bg-primary text-white'
										: 'bg-base-300 text-content'
										}`}
								>
									{selectedItem?.importChildren ? 'با محتوا' : 'بدون محتوا'}
								</button>
							)}
							<FiChevronLeft
								className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
							/>
						</button>
					) : (

						<label htmlFor={item.id} className={`flex items-center gap-2 flex-1 ${!isFolder && getSelectedCount(selectedItems) >= availableSlots && !isSelected ? 'cursor-not-allowed opacity-50' : ''}`} >
							{item.url ? (
								<img
									src={getFaviconFromUrl(item.url)}
									alt={item.title}
									className="size-5 rounded"
									onError={(e) => {
										const target = e.target as HTMLImageElement
										target.style.display = 'none'
									}}
								/>
							) : null}
							<span className="flex-1 text-sm line-clamp-1">{item.title}</span>
						</label>
					)}


				</div>

				{isFolder && isExpanded && hasChildren && (
					<div className="mr-4 mt-1">
						{item.children?.map((child) => renderBookmarkItem(child, level + 1))}
					</div>
				)}
			</div>
		)
	}

	const handleImport = async () => {
		if (selectedItems.size === 0) {
			toast.error('لطفاً حداقل یک مورد را انتخاب کنید')
			return
		}

		setIsImporting(true)
		try {
			const currentFolderItems = getCurrentFolderItems(parentId)
			const maxOrder = currentFolderItems.reduce(
				(max, item) => Math.max(max, item.order || 0),
				-1
			)

			const newBookmarks: LocalBookmark[] = []
			let currentOrder = maxOrder + 1

			// Import folders first
			for (const [id, selectedItem] of selectedItems) {
				if (selectedItem.type === 'FOLDER') {
					const newFolder: LocalBookmark = {
						id: uuidv4(),
						order: currentOrder++,
						isLocal: true,
						onlineId: null,
						parentId: parentId,
						title: selectedItem.title,
						type: 'FOLDER',
						url: null,
						icon: null,
						customBackground: null,
						customTextColor: null,
						sticker: null,
					}
					newBookmarks.push(newFolder)

					// Import children if requested
					if (selectedItem.importChildren && selectedItem.children) {
						const childBookmarks = selectedItem.children.filter(c => c.type === 'BOOKMARK')
						for (const child of childBookmarks) {
							if (child.url) {
								const newBookmark: LocalBookmark = {
									id: uuidv4(),
									order: currentOrder++,
									isLocal: true,
									onlineId: null,
									parentId: newFolder.id,
									title: child.title,
									type: 'BOOKMARK',
									url: child.url,
									icon: null,
									customBackground: null,
									customTextColor: null,
									sticker: null,
								}
								newBookmarks.push(newBookmark)
							}
						}
					}
				}
			}

			// Import bookmarks
			for (const [id, selectedItem] of selectedItems) {
				if (selectedItem.type === 'BOOKMARK' && selectedItem.url) {
					const newBookmark: LocalBookmark = {
						id: uuidv4(),
						order: currentOrder++,
						isLocal: true,
						onlineId: null,
						parentId: parentId,
						title: selectedItem.title,
						type: 'BOOKMARK',
						url: selectedItem.url,
						icon: null,
						customBackground: null,
						customTextColor: null,
						sticker: null,
					}
					newBookmarks.push(newBookmark)
				}
			}

			// Add all new bookmarks to existing bookmarks
			const updatedBookmarks = [...existingBookmarks, ...newBookmarks]
			setBookmarks(updatedBookmarks)
			const localBookmarks = updatedBookmarks.filter((b) => b.isLocal)
			await setToStorage('bookmarks', localBookmarks)

			Analytics.event('import_bookmarks')
			callEvent('startSync', SyncTarget.BOOKMARKS)

			toast.success(`${newBookmarks.length} مورد با موفقیت اضافه شد`)
			onClose()
		} catch (error) {
			console.error('Error importing bookmarks:', error)
			toast.error('خطا در import کردن بوکمارک‌ها')
		} finally {
			setIsImporting(false)
		}
	}

	const selectedCount = getSelectedCount(selectedItems)

	if (!browserBookmarksEnabled || showPermissionInfoModal) {
		return (
			<BookmarkPermissionInfoModal
				isOpen={isOpen && showPermissionInfoModal}
				onClose={() => {
					setShowPermissionInfoModal(false)
					onClose()
				}}
				onConfirm={handlePermissionInfoConfirm}
			/>
		)
	}

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="lg"
			title="وارد کردن بوکمارک"
			direction="rtl"
			closeOnBackdropClick={true}
		>
			<div className="flex flex-col gap-4 h-[500px]">
				<div className="flex-1 overflow-y-auto border border-base-300/40 rounded-xl p-4">
					{loading ? (
						<div className="flex items-center justify-center h-full">
							<span className="text-muted">در حال بارگذاری...</span>
						</div>
					) : browserBookmarks.length === 0 ? (
						<div className="flex items-center justify-center h-full">
							<span className="text-muted">بوکمارکی یافت نشد</span>
						</div>
					) : (
						<div className="space-y-1">
							{browserBookmarks.map((item) => renderBookmarkItem(item))}
						</div>
					)}
				</div>

				<div className="flex items-center justify-between px-2">
					<span className="text-sm text-muted">
						{selectedCount} از {availableSlots} جایگاه پر شده
					</span>
					{selectedCount > 0 && (
						<Button
							onClick={handleImport}
							size="md"
							isPrimary={true}
							loading={isImporting}
							disabled={isImporting}
							className="btn rounded-2xl"
						>
							افزودن
						</Button>
					)}
				</div>

			</div>
		</Modal>
	)
}

