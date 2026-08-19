import { useGetNews, type FetchedRssItem } from '@/services/hooks/news/get-news.hook'
import { Icon } from '@/src/icons'
import Analytics from '@/analytics'

function NewsBannerCard({ news }: { news: FetchedRssItem }) {
	const handleOpen = (e: React.MouseEvent) => {
		e.stopPropagation()
		if (news.link) {
			window.open(news.link, '_blank', 'noopener,noreferrer')
			Analytics.event('rss_link_opened')
		}
	}

	return (
		<div
			onClick={handleOpen}
			className="flex items-center justify-between gap-2 p-2 rounded-xl bg-base-200/40 border border-base-content/10 min-w-0 h-full select-none cursor-pointer hover:bg-base-200/70 transition-colors overflow-hidden"
		>
			<div className="flex items-center gap-2 min-w-0">
				{news.image_url ? (
					<img
						src={news.image_url}
						alt="news"
						className="w-7 h-7 rounded-lg object-cover shrink-0"
					/>
				) : (
					<div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
						<Icon name="outlineNewspaper" className="w-3.5 h-3.5" />
					</div>
				)}

				<div className="flex flex-col min-w-0">
					<span className="text-xs font-bold text-content truncate">
						{news.title}
					</span>
					<span className="text-[9px] text-base-content/60 mt-0.5 truncate">
						{news.source?.name || 'خبرگزاری'}
					</span>
				</div>
			</div>

			<Icon name="chevronLeft" className="w-3 h-3 text-muted shrink-0" />
		</div>
	)
}

export function NewsWideBanner() {
	const { data, isLoading } = useGetNews(true)
	const topNews = data.news?.slice(0, 2) || []

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 gap-2 h-full w-full select-none">
				<div className="p-2 rounded-xl bg-base-200/40 skeleton" />
				<div className="p-2 rounded-xl bg-base-200/40 skeleton" />
			</div>
		)
	}

	if (topNews.length === 0) {
		return (
			<div className="flex items-center justify-center gap-2 h-full w-full text-xs text-muted select-none">
				<Icon name="outlineNewspaper" className="w-4 h-4 text-primary" />
				<span>خبری برای نمایش وجود ندارد</span>
			</div>
		)
	}

	return (
		<div className="grid grid-cols-2 gap-2 h-full w-full select-none overflow-hidden">
			{topNews.map((item, idx) => (
				<NewsBannerCard key={item.link || idx} news={item} />
			))}
		</div>
	)
}
