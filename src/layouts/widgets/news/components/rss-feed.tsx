import Analytics from '@/analytics'
import { Icon } from '@/icons'
import { useGetRss } from '@/services/hooks/news/get-news.hook'
import { NewsItem } from './news-item'
import { NewsSkeleton } from './news-skeleton'

const SKELETON_COUNT = 3

interface Prop {
	url: string
	sourceName: string
	label: string
}

const openNewsLink = () => {
	Analytics.event('rss_link_opened')
}

export function RssFeedComponent({ url, sourceName, label }: Prop) {
	const { data, isLoading, isError, refetch } = useGetRss(url, sourceName)

	if (isLoading) {
		return (
			<>
				{Array.from({ length: SKELETON_COUNT }, (_, i) => (
					<NewsSkeleton key={`news-skeleton-${sourceName}-${i}`} />
				))}
			</>
		)
	}

	if (isError) {
		return (
			<div className="flex items-center justify-between gap-2 p-2 border rounded-2xl border-subtle bg-subtle">
				<span className="flex items-center gap-1.5 min-w-0 text-[11px] text-muted">
					<Icon name="alert" size={13} aria-hidden="true" />
					<span className="truncate">{label} دریافت نشد</span>
				</span>
				<button
					type="button"
					onClick={() => refetch()}
					className="px-2 py-0.5 text-[10px] font-bold rounded-lg cursor-pointer shrink-0 text-content bg-muted transition-ui hover:bg-strong focus-visible:focus-ring"
				>
					تلاش دوباره
				</button>
			</div>
		)
	}

	return (
		<>
			{data?.map((rss) => (
				<NewsItem
					key={rss.link || `${rss.source.name}-${rss.publishedAt}-${rss.title}`}
					title={rss.title}
					image_url={rss.image_url}
					source={rss.source}
					publishedAt={rss.publishedAt}
					link={rss.link}
					onOpen={openNewsLink}
				/>
			))}
		</>
	)
}
