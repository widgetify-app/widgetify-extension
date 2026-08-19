import { useGetNews } from '@/services/hooks/news/get-news.hook'
import { Icon } from '@/src/icons'
import Analytics from '@/analytics'

export function NewsCompactRow() {
	const { data: newsItems, isLoading } = useGetNews(true)
	const topNews = newsItems?.[0]

	const handleOpen = () => {
		if (topNews?.link) {
			window.open(topNews.link, '_blank', 'noopener,noreferrer')
			Analytics.event('rss_link_opened')
		}
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-between h-full w-full px-3.5 py-2 select-none">
				<div className="flex items-center gap-2">
					<div className="w-4 h-4 rounded skeleton" />
					<div className="w-36 h-4 rounded skeleton" />
				</div>
				<div className="w-12 h-3 rounded skeleton" />
			</div>
		)
	}

	if (!topNews) {
		return (
			<div className="flex items-center justify-center gap-2 h-full w-full text-xs text-muted select-none">
				<Icon name="outlineNewspaper" className="w-4 h-4 text-primary" />
				<span>خبری برای نمایش وجود ندارد</span>
			</div>
		)
	}

	return (
		<div
			onClick={handleOpen}
			className="flex items-center justify-between h-full w-full px-3.5 py-2 select-none cursor-pointer hover:bg-base-200/30 transition-colors"
		>
			<div className="flex items-center gap-2.5 min-w-0">
				<div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
					<Icon name="outlineNewspaper" className="w-3.5 h-3.5" />
				</div>

				<div className="flex flex-col min-w-0">
					<span className="text-xs font-bold text-content truncate max-w-44">
						{topNews.title}
					</span>
					<span className="text-[9px] text-base-content/60 mt-0.5 truncate">
						{topNews.source?.name || 'خبرگزاری'}
					</span>
				</div>
			</div>

			<div className="flex items-center gap-1 text-[10px] text-primary shrink-0">
				<span>مشاهده</span>
				<Icon name="chevronLeft" className="w-3 h-3" />
			</div>
		</div>
	)
}
