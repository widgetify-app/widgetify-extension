import { useEffect, useState } from 'react'
import { Motion, Presence } from '@/common/motion'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { Button, Portal } from '@/components/ui'
import { useGeneralSetting } from '@/context/general-setting.context'
import { Icon } from '@/icons'
import {
	type FetchedBrowserBookmark,
	getBrowserBookmarks,
} from '@/layouts/bookmark/utils/browser-bookmarks'
import Analytics from '@/analytics'

interface BookmarkPopoverProps {
	isOpen: boolean
	onClose: () => void
	coords: { top: number; left: number }
}

const ROOT_PARENT_IDS = ['0', 'root']

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
			if (!(e.target as Element).closest('.bookmark-popover')) {
				onClose()
				setCurrentFolderId(null)
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isOpen, onClose])

	const displayItems = fetchedBookmarks.filter((bookmark) => {
		if (currentFolderId) return bookmark.parentId === currentFolderId
		return !bookmark.parentId || ROOT_PARENT_IDS.includes(bookmark.parentId)
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
			return
		}

		if (item.url) {
			window.open(item.url, '_blank')
			Analytics.event('browser_bookmark_clicked')
		}
	}

	const currentFolderTitle =
		fetchedBookmarks.find((b) => b.id === currentFolderId)?.title || 'بوکمارک‌های من'

	return (
		<Portal>
			<Presence>
				{isOpen && (
					<Motion.div
						key="bookmark-popover"
						className="fixed overflow-hidden border shadow-2xl bookmark-popover z-popover w-72 border-base-content/10 rounded-2xl origin-top-left bg-content bg-glass"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.15, ease: 'easeOut' }}
						style={{ top: coords.top, left: coords.left, direction: 'rtl' }}
					>
						{!browserBookmarksEnabled ? (
							<div className="p-5 text-center">
								<div className="flex items-center justify-center w-8 h-8 mx-auto mb-3 rounded-full bg-primary/10">
									<Icon
										name="lock"
										className="text-primary"
										size={18}
										aria-hidden="true"
									/>
								</div>
								<p className="mb-1 text-sm font-bold">
									دسترسی به بوکمارک‌ها
								</p>
								<p className="mb-4 text-xs leading-relaxed text-muted">
									برای مشاهده بوکمارک‌های مرورگر در این بخش، نیاز به
									دسترسی شما داریم.
								</p>
								<Button
									size="sm"
									onClick={handlePermission}
									className="w-full"
									color="primary"
									rounded="2xl"
								>
									فعال‌سازی دسترسی
								</Button>
							</div>
						) : (
							<div className="flex flex-col max-h-105">
								<div className="flex items-center justify-between p-3 border-b border-base-content/5">
									<span className="text-xs font-bold text-content">
										{currentFolderTitle}
									</span>
									{currentFolderId && (
										<Button
											size="sm"
											onClick={handleGoBack}
											rounded="xl"
											className="text-[10px] flex items-center gap-1!"
										>
											<Icon
												name="chevronRight"
												aria-hidden="true"
											/>
											بازگشت
										</Button>
									)}
								</div>

								<ul className="overflow-y-auto p-1.5">
									{displayItems.length > 0 ? (
										displayItems.map((item) => (
											<li key={item.id}>
												<button
													type="button"
													onClick={() => handleClickItem(item)}
													className="flex items-center gap-2.5 p-2 w-full text-right bg-transparent border-none rounded-xl cursor-pointer group transition-ui hover:bg-primary/5 hover:text-primary/80 focus-visible:focus-ring"
												>
													{item.type === 'FOLDER' ? (
														<Icon
															name="folder"
															className="text-primary/80 shrink-0"
															size={18}
															aria-hidden="true"
														/>
													) : (
														<img
															src={getFaviconFromUrl(
																item.url || ''
															)}
															className="w-4 h-4 rounded-sm shrink-0"
															alt=""
															loading="lazy"
														/>
													)}
													<span className="flex-1 min-w-0 text-xs font-medium truncate">
														{item.title}
													</span>
													<Icon
														name={
															item.type === 'FOLDER'
																? 'chevronLeft'
																: 'externalLink'
														}
														size={12}
														aria-hidden="true"
														className="opacity-20 group-hover:opacity-50"
													/>
												</button>
											</li>
										))
									) : (
										<li className="py-8 text-xs text-center text-muted">
											پوشه خالی است
										</li>
									)}
								</ul>
							</div>
						)}
					</Motion.div>
				)}
			</Presence>
		</Portal>
	)
}
