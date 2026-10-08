import Analytics from '@/analytics'
import { t } from '@/common/i18n'
import { WidgetEmpty } from '@/features/widgets/components/widget-empty'
import type { NewsFeedEntry } from '../hooks/use-news-feeds'
import { headlineKey, mergeHeadlines } from '../utils/merge-headlines'
import { formatTimeAgo } from '../utils/time-ago'
import { FeedErrorRow } from './feed-error-row'
import { NewsEmpty } from './news-empty'
import { NewsItem } from './news-item'
import { NewsSkeleton } from './news-skeleton'

const SKELETON_COUNT = 4

interface NewsContainerProps {
	entries: NewsFeedEntry[]
	now: number
}

const openNewsLink = () => {
	Analytics.event('rss_link_opened')
}

export const NewsContainer = ({ entries, now }: NewsContainerProps) => {
	if (entries.length === 0) {
		return <NewsEmpty />
	}

	const headlines = mergeHeadlines(entries.map((entry) => entry.result.data ?? []))
	const failed = entries.filter((entry) => entry.result.isError)
	const isLoading = entries.some((entry) => entry.result.isLoading)

	if (headlines.length === 0 && failed.length === 0) {
		return isLoading ? (
			<ul aria-busy="true" className="flex flex-col flex-1 min-h-0 gap-0.5">
				{Array.from({ length: SKELETON_COUNT }, (_, i) => (
					<li key={`news-skeleton-${i}`}>
						<NewsSkeleton />
					</li>
				))}
			</ul>
		) : (
			<WidgetEmpty
				art="outlineNewspaper"
				title={t('widgets.news.emptyTitle')}
				description={t('widgets.news.emptyDescription')}
			/>
		)
	}

	return (
		<ul
			aria-label={t('widgets.news.aria')}
			aria-busy={isLoading}
			className="flex flex-col flex-1 min-h-0 gap-0.5 overflow-y-auto scrollbar-none"
		>
			{headlines.map((item) => (
				<li key={headlineKey(item)}>
					<NewsItem
						title={item.title}
						image_url={item.image_url}
						source={item.source}
						publishedAgo={formatTimeAgo(item.publishedAt, now)}
						link={item.link}
						onOpen={openNewsLink}
					/>
				</li>
			))}
			{failed.map((entry) => (
				<FeedErrorRow
					key={entry.feed.id}
					label={entry.label}
					onRetry={() => entry.result.refetch()}
				/>
			))}
		</ul>
	)
}
