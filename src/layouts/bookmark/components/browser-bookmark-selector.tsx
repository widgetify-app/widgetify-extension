import { useEffect, useState } from 'react'
import { FaGlobe } from 'react-icons/fa'
import { FiFolder } from 'react-icons/fi'
import { getFaviconFromUrl } from '@/common/utils/icon'
import { SectionPanel } from '@/components/section-panel'
import { useGeneralSetting } from '@/context/general-setting.context'
import {
	type FetchedBrowserBookmark,
	getBrowserBookmarks,
} from '../utils/browser-bookmarks.util'

interface BrowserBookmarkSelectorProps {
	onSelect: (bookmark: { title: string; url: string; icon: string | null }) => void
}

export function BrowserBookmarkSelector({ onSelect }: BrowserBookmarkSelectorProps) {
	const { browserBookmarksEnabled } = useGeneralSetting()
	const [bookmarks, setBookmarks] = useState<FetchedBrowserBookmark[]>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		async function loadBookmarks() {
			if (!browserBookmarksEnabled) return

			setLoading(true)
			try {
				const fetched = await getBrowserBookmarks({ includeFolders: false })
				// فقط بوکمارک‌ها (نه پوشه‌ها) و حداکثر 20 تا
				const bookmarksOnly = fetched
					.filter((b) => b.type === 'BOOKMARK' && b.url)
					.slice(0, 20)
				setBookmarks(bookmarksOnly)
			} catch (error) {
				console.error('Error loading browser bookmarks:', error)
			} finally {
				setLoading(false)
			}
		}

		loadBookmarks()
	}, [browserBookmarksEnabled])

	if (!browserBookmarksEnabled) {
		return null
	}

	if (loading) {
		return (
			<div className="mt-2">
				<SectionPanel title="بوکمارک‌های مرورگر" size="xs">
					<div className="flex items-center justify-center h-16">
						<span className="text-sm text-muted">در حال بارگذاری...</span>
					</div>
				</SectionPanel>
			</div>
		)
	}

	if (bookmarks.length === 0) {
		return null
	}

	return (
		<div className="mt-2">
			<SectionPanel title="بوکمارک‌های مرورگر" size="xs">
				<div className="grid h-16 grid-cols-5 gap-2 mt-1 overflow-y-auto">
					{bookmarks.map((bookmark) => (
						<div
							key={bookmark.id}
							onClick={() =>
								onSelect({
									title: bookmark.title,
									url: bookmark.url || '',
									icon: bookmark.url ? getFaviconFromUrl(bookmark.url) : null,
								})
							}
							className="p-2 flex flex-col items-center gap-y-0.5 text-center transition-colors duration-200 bg-content hover:!bg-base-300/75 border border-base-300/40 rounded-xl cursor-pointer"
						>
							<div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mb-1">
								{bookmark.url ? (
									<img
										src={getFaviconFromUrl(bookmark.url)}
										alt={bookmark.title}
										className="object-contain w-6 h-6 rounded-md"
										onError={(e) => {
											const target = e.target as HTMLImageElement
											target.style.display = 'none'
											target.nextElementSibling?.classList.remove('hidden')
										}}
									/>
								) : null}
								<FaGlobe className="hidden w-4 h-4 text-content/60" />
							</div>
							<p className="w-full text-[11px] font-medium truncate text-muted">
								{bookmark.title}
							</p>
						</div>
					))}
				</div>
			</SectionPanel>
		</div>
	)
}
