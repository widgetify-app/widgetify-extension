import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FiChevronRight, FiFolder, FiExternalLink, FiLock } from 'react-icons/fi'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { useGeneralSetting } from '@/context/general-setting.context'
import {
	type FetchedBrowserBookmark,
	getBrowserBookmarks,
} from '@/layouts/bookmark/utils/browser-bookmarks.util'
import Analytics from '@/analytics'
import { Button } from '@/components/button/button'
import { HiChevronRight } from 'react-icons/hi2'

interface BookmarkPopoverProps {
	isOpen: boolean
	onClose: () => void
	coords: { top: number; left: number }
}

export function BookmarkPopover({ isOpen, onClose, coords }: BookmarkPopoverProps) {
	const { browserBookmarksEnabled, setBrowserBookmarksEnabled } = useGeneralSetting()
	const [fetchedBookmarks, setFetchedBookmarks] = useState<FetchedBrowserBookmark[]>([])
	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)

	useEffect(() => {
		async function fetchBookmarks() {
			const bookmarks = await getBrowserBookmarks({ includeFolders: true })
			setFetchedBookmarks(bookmarks)
		}
		if (browserBookmarksEnabled && isOpen) {
			fetchBookmarks()
		}
	}, [browserBookmarksEnabled, isOpen])

	useEffect(() => {
		if (!isOpen) return
		const handleClickOutside = (e: MouseEvent) => {
			if (isOpen && !(e.target as Element).closest('.bookmark-popover')) {
				onClose()
				setCurrentFolderId(null)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen, onClose])

	if (!isOpen) return null

	const displayItems = fetchedBookmarks.filter((b) => {
		if (currentFolderId) return b.parentId === currentFolderId
		return b.parentId === '0' || b.parentId === 'root' || !b.parentId
	})

	const handleGoBack = () => {
		Analytics.event('browser_bookmark_back_clicked')
		const current = fetchedBookmarks.find((b) => b.id === currentFolderId)
		setCurrentFolderId(current?.parentId ?? null)
	}

	const handlePermission = () => {
		Analytics.event('browser_bookmark_permission_clicked')
		setBrowserBookmarksEnabled(true)
	}

	const handleClickItem = (item: FetchedBrowserBookmark) => {
		if (item.type === 'FOLDER') {
			Analytics.event('browser_bookmark_folder_opened')
			setCurrentFolderId(item.id)
		} else if (item.url) {
			window.open(item.url, '_blank')
			Analytics.event('browser_bookmark_clicked')
		}
	}

	const c =
		fetchedBookmarks.find((b) => b.id === currentFolderId)?.title || 'بوکمارک‌های من'

	return createPortal(
		<div
			className="bookmark-popover fixed z-[9999] w-72  border border-base-content/10 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-left bg-content bg-glass"
			style={{
				top: coords.top,
				left: coords.left,
				direction: 'rtl',
			}}
		>
			{!browserBookmarksEnabled ? (
				<div className="p-5 text-center">
					<div className="flex items-center justify-center w-8 h-8 mx-auto mb-3 rounded-full bg-primary/10">
						<FiLock className="text-primary" size={18} />
					</div>
					<p className="mb-1 text-sm font-bold">دسترسی به بوکمارک‌ها</p>
					<p className="mb-4 text-xs leading-relaxed text-muted">
						برای مشاهده بوکمارک‌های مرورگر در این بخش، نیاز به دسترسی شما
						داریم.
					</p>
					<Button
						size="sm"
						onClick={() => handlePermission()}
						className="w-full rounded-2xl"
						isPrimary
					>
						فعال‌سازی دسترسی
					</Button>
				</div>
			) : (
				<div className="flex flex-col max-h-[420px]">
					<div className="flex items-center justify-between p-3 border-b border-base-content/5 bg-base-200/30">
						<span className="text-xs font-bold text-content">{c}</span>
						{currentFolderId && (
							<Button
								size="sm"
								onClick={handleGoBack}
								className="text-[10px] btn-ghost text-muted rounded-xl flex items-center gap-1!"
							>
								<HiChevronRight />
								بازگشت
							</Button>
						)}
					</div>

					<div className="overflow-y-auto p-1.5 custom-scrollbar">
						{displayItems.length > 0 ? (
							displayItems.map((item) => (
								<div
									key={item.id}
									onClick={() => handleClickItem(item)}
									className="flex items-center gap-2.5 p-2 hover:bg-primary/5 hover:text-primary/80 rounded-xl cursor-pointer transition-all group"
								>
									{item.type === 'FOLDER' ? (
										<FiFolder
											className="text-primary/80 shrink-0"
											size={18}
										/>
									) : (
										<img
											src={getFaviconFromUrl(item.url || '')}
											className="w-4 h-4 rounded-sm shrink-0"
											alt=""
										/>
									)}
									<span className="flex-1 text-xs font-medium truncate">
										{item.title}
									</span>
									{item.type === 'FOLDER' ? (
										<FiChevronRight
											size={12}
											className="opacity-20 group-hover:opacity-50"
										/>
									) : (
										<FiExternalLink
											size={12}
											className="opacity-0 group-hover:opacity-30"
										/>
									)}
								</div>
							))
						) : (
							<div className="py-8 text-xs text-center text-muted">
								پوشه خالی است
							</div>
						)}
					</div>
				</div>
			)}
		</div>,
		document.body
	)
}
