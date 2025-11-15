import { useEffect, useState } from 'react'
import { type RecommendedSite, useGetTrends } from '@/services/hooks/trends/getTrends'
import 'swiper/css'

import { FiChevronLeft, FiFolder } from 'react-icons/fi'
import { FreeMode, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import Analytics from '@/analytics'
import { getFromStorage, setToStorage } from '@/common/storage'
import { getFaviconFromUrl } from '@/common/utils/icon'
import Tooltip from '@/components/toolTip'
import { useGeneralSetting } from '@/context/general-setting.context'
import {
	type FetchedBrowserBookmark,
	getBrowserBookmarks,
} from '@/layouts/bookmark/utils/browser-bookmarks.util'

interface BookmarkItem {
	id?: string
	name?: string
	title?: string
	url?: string | null
	icon?: string | React.ReactNode
	isFolder?: boolean
}

interface BookmarkSwiperProps {
	items: BookmarkItem[]
	spaceBetween?: number
	grabCursor?: boolean
	navigation?: boolean
	slidesPerView: number
	type: 'browser' | 'recommended'
}

function BookmarkSwiper({
	items,
	spaceBetween = 1,
	grabCursor = true,
	type,
	onItemClick,
	slidesPerView,
}: BookmarkSwiperProps & { onItemClick?: (item: BookmarkItem) => void }) {
	const swiperProps = {
		modules: [FreeMode, Navigation],
		spaceBetween,
		slidesPerView,
		grabCursor,
		className: 'w-full bg-content rounded-2xl !pl-3.5 !pr-1',
		dir: 'rtl' as const,
	}

	function onClick(item: BookmarkItem) {
		if (onItemClick) {
			onItemClick(item)
			Analytics.event('browser_bookmark_folder_clicked')
			return
		}

		if (item.url) {
			window.open(item.url, '_blank')
			Analytics.event(`${type}_bookmark_clicked`)
		}
	}

	return (
		<Swiper {...swiperProps}>
			{items.map((item, index) => (
				<SwiperSlide key={item.id || item.name || index}>
					<Tooltip content={item.name || item.title || item.url || ''}>
						<div
							className="flex items-center mt-1 cursor-pointer group"
							onClick={() => onClick(item)}
						>
							{typeof item.icon === 'string' ? (
								<img
									src={item.icon || getFaviconFromUrl(item.url || '')}
									className="object-cover w-4 h-4 sm:w-6 sm:h-6 text-xs p-0.5 transition-transform duration-200 !rounded-full group-hover:scale-110 bg-primary/20"
								/>
							) : item.icon ? (
								<div className="flex items-center justify-center w-4 h-4 sm:w-6 sm:h-6 text-xs p-0.5 transition-transform duration-200 rounded-full group-hover:scale-110 bg-primary/20">
									{item.icon}
								</div>
							) : (
								<img
									src={getFaviconFromUrl(item.url || '')}
									className="object-cover w-4 h-4 sm:w-6 sm:h-6 text-xs p-0.5 transition-transform duration-200 !rounded-full group-hover:scale-110 bg-primary/20"
								/>
							)}
						</div>
					</Tooltip>
				</SwiperSlide>
			))}
		</Swiper>
	)
}

export function BrowserBookmark() {
	const { browserBookmarksEnabled } = useGeneralSetting()

	const { data } = useGetTrends({
		enabled: true,
	})
	const [fetchedBookmarks, setFetchedBookmarks] = useState<FetchedBrowserBookmark[]>([])
	const [browserBookmarks, setBrowserBookmarks] = useState<BookmarkItem[]>([])
	const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)

	useEffect(() => {
		async function fetchBrowserBookmarks() {
			const bookmarks = await getBrowserBookmarks({ includeFolders: true })

			setFetchedBookmarks(bookmarks)
		}
		if (browserBookmarksEnabled) {
			fetchBrowserBookmarks()
		}
	}, [browserBookmarksEnabled])

	useEffect(() => {
		const isOtherFolderTitle = (title?: string) => {
			if (!title) return false
			const t = title.toLowerCase()
			return t.includes('other') && t.includes('bookmark')
		}

		let candidates: FetchedBrowserBookmark[] = []
		if (currentFolderId) {
			candidates = fetchedBookmarks.filter(
				(b) => (b.parentId ?? null) === currentFolderId
			)
		} else {
			const otherFolder = fetchedBookmarks.find(
				(b) => b.type === 'FOLDER' && isOtherFolderTitle(b.title)
			)

			const rootEntries = fetchedBookmarks.filter(
				(b) => (b.parentId ?? null) === null && b.id !== otherFolder?.id
			)

			const otherChildren = otherFolder
				? fetchedBookmarks.filter((b) => b.parentId === otherFolder.id)
				: []

			candidates = [...rootEntries, ...otherChildren]
		}

		const visible = candidates.map((b) => ({
			id: b.id,
			title: b.title,
			url: b.url,
			icon:
				b.type === 'FOLDER' ? (
					<FiFolder size={16} />
				) : (
					getFaviconFromUrl(b.url || '')
				),
			isFolder: b.type === 'FOLDER',
		}))

		setBrowserBookmarks(visible)
	}, [fetchedBookmarks, currentFolderId])

	useEffect(() => {
		if (data?.recommendedSites?.length) {
			setToStorage('recommended_sites', data.recommendedSites)
		}
	}, [data])

	return (
		<div
			className={`flex flex-row w-full gap-2 px-2  py-1 ${browserBookmarksEnabled ? 'justify-between' : 'justify-end'}`}
		>
			<BookmarkSwiper
				items={data?.recommendedSites || []}
				spaceBetween={1}
				grabCursor={true}
				type="recommended"
				slidesPerView={browserBookmarksEnabled ? 8 : 16}
			/>
			{browserBookmarksEnabled && (
				<BookmarkSwiper
					slidesPerView={8}
					items={
						currentFolderId
							? [
									{
										id: '__up__',
										title: 'بازگشت',
										icon: <FiChevronLeft />,
										isFolder: false,
									} as BookmarkItem,
									...browserBookmarks,
								]
							: browserBookmarks
					}
					spaceBetween={2}
					grabCursor={false}
					type="browser"
					onItemClick={(item) => {
						if (item.id === '__up__') {
							const current = fetchedBookmarks.find(
								(b) => b.id === currentFolderId
							)
							setCurrentFolderId(current?.parentId ?? null)
							return
						}

						if (item.isFolder) {
							setCurrentFolderId(item.id || null)
						} else if (item.url) {
							window.open(item.url, '_blank')
						}
					}}
				/>
			)}
		</div>
	)
}
