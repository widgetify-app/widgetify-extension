import type { RssFeed } from '../rss.interface'
import { RssFeedComponent } from '../rss-feed'

interface NewsContainerProps {
	customFeeds: RssFeed[]
	useDefaultNews: boolean
}

export const NewsContainer = ({ customFeeds, useDefaultNews }: NewsContainerProps) => {
	const enabledFeeds = customFeeds.filter((feed) => feed.enabled)
	if (useDefaultNews) {
		enabledFeeds.unshift({
			id: 'default',
			enabled: true,
			name: 'DEFAULT',
			url: 'DEFAULT',
		})
	}

	return (
		<div className={`flex flex-col h-full gap-1`}>
			{enabledFeeds.map((feed) => (
				<RssFeedComponent key={feed.url} url={feed.url} sourceName={feed.name} />
			))}
		</div>
	)
}
