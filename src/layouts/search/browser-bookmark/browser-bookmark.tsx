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
		<div className="flex flex-row justify-between w-full gap-2 p-2">
			<Swiper
				modules={[FreeMode, Navigation]}
				spaceBetween={1}
				slidesPerView={8}
				grabCursor={true}
				className="w-full user-list-slider bg-content rounded-2xl !px-1"
				dir="rtl"
				navigation={{
					nextEl: '.user-list-next',
					prevEl: '.user-list-prev',
				}}
			>
				{recommendedSites.map((site) => (
					<SwiperSlide key={site.name}>
						<Tooltip content={site.name}>
							<div
								className="flex items-center mt-1 cursor-pointer group"
								onClick={() =>
									site.url && window.open(site.url, '_blank')
								}
							>
								<img
									src={site.icon || getFaviconFromUrl(site.url || '')}
									className="object-cover w-6 h-6 text-xs p-0.5 transition-transform duration-200 !rounded-full group-hover:scale-110 bg-primary/20"
								/>
							</div>
						</Tooltip>
					</SwiperSlide>
				))}
			</Swiper>
			<Swiper
				modules={[FreeMode, Navigation]}
				spaceBetween={2}
				slidesPerView={8}
				grabCursor={false}
				className="w-full user-list-slider bg-content rounded-2xl !px-1"
				dir="rtl"
			>
				{browserBookmarks.map((bookmark, index) => (
					<SwiperSlide key={bookmark.id}>
						<Tooltip content={bookmark.title || bookmark.url} key={index}>
							<div
								className="flex items-center mt-1 cursor-pointer group"
								onClick={() =>
									bookmark.url && window.open(bookmark.url, '_blank')
								}
							>
								<img
									src={getFaviconFromUrl(bookmark.url || '')}
									className="object-cover w-6 h-6 text-xs p-0.5 transition-transform duration-200 !rounded-full group-hover:scale-110 bg-primary/20"
								/>
							</div>
						</Tooltip>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}
