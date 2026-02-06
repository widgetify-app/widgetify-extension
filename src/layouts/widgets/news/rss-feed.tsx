import Analytics from '@/analytics'
import { useGetRss } from '../../../services/hooks/news/getNews.hook'
import { NewsItem } from './components/news-item'

interface Prop {
	url: string
	sourceName: string
}

const openNewsLink = (url: string) => {
	window.open(url, '_blank', 'noopener,noreferrer')
	Analytics.event('rss_link_opened')
}

export function RssFeedComponent({ url, sourceName }: Prop) {
	const { data } = useGetRss(url, sourceName)

	return data?.map((rss, index) => (
		<NewsItem
			key={`rssfeed-${index}`}
			title={rss.title}
			description={rss.description}
			image_url={rss.image_url}
			source={rss.source}
			publishedAt={rss.publishedAt}
			link={'link' in rss ? (rss.link as string) : undefined}
			index={index}
			onClick={openNewsLink}
		/>
	))
}
