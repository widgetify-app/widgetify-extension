import { useEffect, useState } from 'react'
import { type RecommendedSite, useGetTrends } from '@/services/hooks/trends/getTrends'
//@ts-ignore
import 'swiper/css'

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
	icon?: string
}

interface BookmarkSwiperProps {
	items: BookmarkItem[]
	spaceBetween?: number
	grabCursor?: boolean
	navigation?: boolean
	type: 'browser' | 'recommended'
}

function BookmarkSwiper({
	items,
	spaceBetween = 1,
	grabCursor = true,
	type,
}: BookmarkSwiperProps) {
	const { browserBookmarksEnabled } = useGeneralSetting()

	const swiperProps = {
		modules: [FreeMode, Navigation],
		spaceBetween,
		slidesPerView: 8,
		grabCursor,
		className: 'w-full bg-content rounded-2xl !pl-3.5 !pr-1',
		dir: 'rtl' as const,
	}

	function onClick(item: BookmarkItem) {
		if (item.url) {
			window.open(item.url, '_blank')
			Analytics.event(`${type}_bookmark_clicked`)
		}
	}
	if (!browserBookmarksEnabled && type === 'browser') return null
	return (
		<Swiper {...swiperProps}>
			{items.map((item, index) => (
				<SwiperSlide key={item.id || item.name || index}>
					<Tooltip content={item.name || item.title || item.url || ''}>
						<div
							className="flex items-center mt-1 cursor-pointer group"
							onClick={() => onClick(item)}
						>
							<img
								src={item.icon || getFaviconFromUrl(item.url || '')}
								className="object-cover w-4 h-4 sm:w-6 sm:h-6 text-xs p-0.5 transition-transform duration-200 !rounded-full group-hover:scale-110 bg-primary/20"
							/>
						</div>
					</Tooltip>
				</SwiperSlide>
			))}
		</Swiper>
	)
}

export function BrowserBookmark() {
	const { data, isError } = useGetTrends({
		enabled: true,
	})

	const [recommendedSites, setRecommendedSites] = useState<RecommendedSite[]>([])
	const [browserBookmarks, setBrowserBookmarks] = useState<FetchedBrowserBookmark[]>([])

	useEffect(() => {
		async function fetchBrowserBookmarks() {
			const bookmarks = await getBrowserBookmarks()
			setBrowserBookmarks(bookmarks)
		}
		fetchBrowserBookmarks()
	}, [])

	useEffect(() => {
		if (data) {
			if (data.recommendedSites?.length) {
				setRecommendedSites(data.recommendedSites)
				setToStorage('recommended_sites', data.recommendedSites)
			}
		}

		if (isError) {
			const fetchDataFromStorage = async () => {
				const storedSites = await getFromStorage('recommended_sites')
				if (storedSites?.length) {
					setRecommendedSites(storedSites)
				}
			}

			fetchDataFromStorage()
		}
	}, [data, isError])

	return (
		<div className="flex flex-row justify-between w-full gap-2 px-2 py-1">
			<BookmarkSwiper
				items={recommendedSites}
				spaceBetween={1}
				grabCursor={true}
				type="recommended"
			/>
			<BookmarkSwiper
				items={browserBookmarks}
				spaceBetween={2}
				grabCursor={false}
				type="browser"
			/>
		</div>
	)
}
