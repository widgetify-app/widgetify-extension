import { useEffect, useState } from 'react'
import { type RecommendedSite, useGetTrends } from '@/services/hooks/trends/getTrends'
//@ts-ignore
import 'swiper/css'

import { FreeMode, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { getFromStorage, setToStorage } from '@/common/storage'
import { getFaviconFromUrl } from '@/common/utils/icon'
import Tooltip from '@/components/toolTip'
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
}

function BookmarkSwiper({
	items,
	spaceBetween = 1,
	grabCursor = true,
	navigation = false,
}: BookmarkSwiperProps) {
	const swiperProps = {
		modules: [FreeMode, Navigation],
		spaceBetween,
		slidesPerView: 8,
		grabCursor,
		className: 'w-full user-list-slider bg-content rounded-2xl !px-1',
		dir: 'rtl' as const,
		...(navigation && {
			navigation: {
				nextEl: '.user-list-next',
				prevEl: '.user-list-prev',
			},
		}),
	}

	return (
		<Swiper {...swiperProps}>
			{items.map((item, index) => (
				<SwiperSlide key={item.id || item.name || index}>
					<Tooltip content={item.name || item.title || item.url || ''}>
						<div
							className="flex items-center mt-1 cursor-pointer group"
							onClick={() => item.url && window.open(item.url, '_blank')}
						>
							<img
								src={item.icon || getFaviconFromUrl(item.url || '')}
								className="object-cover w-6 h-6 text-xs p-0.5 transition-transform duration-200 !rounded-full group-hover:scale-110 bg-primary/20"
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
				navigation={true}
			/>
			<BookmarkSwiper
				items={browserBookmarks}
				spaceBetween={2}
				grabCursor={false}
				navigation={false}
			/>
		</div>
	)
}
