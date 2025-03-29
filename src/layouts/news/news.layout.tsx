import { getFromStorage, setToStorage } from '@/common/storage'
import { OfflineIndicator } from '@/components/offline-indicator'
import { useTheme } from '@/context/theme.context'
import { type NewsResponse, useGetNews } from '@/services/getMethodHooks/getNews.hook'
import { motion } from 'framer-motion'
import moment from 'jalali-moment'
import { useEffect, useState } from 'react'

export const NewsLayout = () => {
	const { themeUtils } = useTheme()
	const { data, isLoading, isError, dataUpdatedAt } = useGetNews()
	const [newsData, setNewsData] = useState<NewsResponse>({
		news: [],
		platform: {
			name: '',
			url: '',
		},
		updatedAt: '',
	})

	const formatDate = (dateString: string) => {
		try {
			const date = new Date(dateString)
			return moment(date).locale('fa').format('HH:mm - jYYYY/jMM/jDD')
		} catch (e) {
			return dateString
		}
	}

	const openNewsLink = (url: string) => {
		window.open(url, '_blank', 'noopener,noreferrer')
	}

	useEffect(() => {
		if (data.news?.length) {
			setNewsData(data)
			setToStorage('news', {
				...data,
				isCached: true,
			})
		}
		if (isError) {
			getFromStorage('news').then((storedData) => {
				if (storedData) {
					setNewsData(storedData)
				}
			})
		}
	}, [dataUpdatedAt, isError])

	return (
		<div className="relative">
			<div
				className={`flex h-80 flex-col gap-1 px-2 py-2 ${themeUtils.getCardBackground()} rounded-2xl `}
				style={{
					scrollbarWidth: 'none',
				}}
			>
				<div
					className={`top-0 z-20 flex items-center justify-between w-full pb-2 mb-2 border-b ${themeUtils.getBorderColor()}`}
				>
					<div className="flex flex-col">
						<div className="flex items-center gap-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="w-5 h-5 text-primary"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
								<path d="M18 14h-8" />
								<path d="M18 18h-8" />
								<path d="M18 10h-8" />
							</svg>
							<p className="text-lg font-bold">آخرین اخبار</p>
						</div>
						{/* @ts-ignore */}
						{newsData.isCached ? (
							<OfflineIndicator
								mode="status"
								message="به دلیل مشکل در اتصال، اطلاعات ذخیره شده قبلی نمایش داده می‌شود"
							/>
						) : data.platform.name ? (
							<a
								href={newsData.platform.url}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center mt-1 text-xs transition-colors opacity-70 hover:opacity-100 hover:text-primary"
							>
								<span>قدرت گرفته از</span>
								<span className="mr-1 font-semibold">{newsData.platform.name}</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="w-3 h-3 mr-1"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path d="M7 7h10v10" />
									<path d="M7 17 17 7" />
								</svg>
							</a>
						) : null}
					</div>
				</div>

				{isLoading ? (
					<div className="flex flex-col items-center justify-center h-full p-4">
						<div className="w-6 h-6 border-2 border-t-2 rounded-full animate-spin border-primary border-t-transparent"></div>
						<p className="mt-2 text-sm opacity-70">در حال دریافت اخبار...</p>
					</div>
				) : newsData.news.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="w-12 h-12 mb-3 opacity-30"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
							<path d="M18 14h-8" />
							<path d="M18 18h-8" />
							<path d="M18 10h-8" />
						</svg>
						<p className="text-sm opacity-50">خبری یافت نشد</p>
					</div>
				) : (
					<div className="flex flex-col h-full gap-3 pb-12 overflow-y-auto">
						{newsData.news.map((item, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: index * 0.1 }}
							>
								<div
									className={
										'p-2 rounded-lg cursor-pointer hover:bg-opacity-50 hover:bg-gray-500/10'
									}
									onClick={() => openNewsLink(item.source.url)}
								>
									<div className="flex items-start justify-between">
										<h3 className="text-sm font-medium">{item.title}</h3>
										<span className="px-2 py-1 mr-1 text-xs rounded-full whitespace-nowrap bg-primary/10 text-primary">
											{item.source.name}
										</span>
									</div>
									<p className="mt-1 text-xs font-light line-clamp-2 opacity-80">
										{item.description?.replace(/\n/g, ' ').replace(/<.*?>/g, '')}
									</p>
									<div className="flex items-center justify-between mt-1 text-xs opacity-60">
										<span></span>
										<span dir="ltr">{formatDate(item.publishedAt)}</span>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
