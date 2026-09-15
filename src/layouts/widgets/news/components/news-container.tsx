import type { RssFeed } from '../rss.interface'
import { NewsEmpty } from './news-empty'
import { RssFeedComponent } from './rss-feed'

const DEFAULT_FEED: RssFeed = {
	id: 'default',
	enabled: true,
	name: 'DEFAULT',
	url: 'DEFAULT',
}

interface NewsContainerProps {
	customFeeds: RssFeed[]
	useDefaultNews: boolean
}

export const NewsContainer = ({ customFeeds, useDefaultNews }: NewsContainerProps) => {
	const enabledFeeds = customFeeds.filter((feed) => feed.enabled)
	const feeds = useDefaultNews ? [DEFAULT_FEED, ...enabledFeeds] : enabledFeeds

	if (feeds.length === 0) {
		return <NewsEmpty />
	}

	return (
		<ul
			aria-label="اخبار"
			className="flex flex-col gap-1.5 overflow-y-auto scrollbar-none"
		>
			{feeds.map((feed) => (
				<li key={feed.id}>
					<RssFeedComponent
						url={feed.url}
						sourceName={feed.name}
						label={feed.id === 'default' ? 'اخبار پیش‌فرض' : feed.name}
					/>
				</li>
			))}
		</ul>
	)
}
