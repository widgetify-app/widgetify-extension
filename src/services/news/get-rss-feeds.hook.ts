import { useQuery } from '@tanstack/react-query'
import { t } from '@/common/i18n'
import { getMainClient } from '@/services/api'
import { newsKeys } from '@/services/news/news.keys'

export interface AvailableRssFeed {
	id: string
	name: string
	url: string
	category?: string
}

function getFallbackAvailableFeeds(): AvailableRssFeed[] {
	return [
		{
			id: 'zoomit',
			name: t('news.feed.zoomit'),
			url: 'https://www.zoomit.ir/feed/',
			category: t('news.category.tech'),
		},
		{
			id: 'digiato',
			name: t('news.feed.digiato'),
			url: 'https://digiato.com/feed/',
			category: t('news.category.tech'),
		},
		{
			id: 'digikala-mag',
			name: t('news.feed.digikalaMag'),
			url: 'https://www.digikala.com/mag/feed/',
			category: t('news.category.tech'),
		},
		{
			id: 'zoomg',
			name: t('news.feed.zoomg'),
			url: 'https://www.zoomg.ir/feed/',
			category: t('news.category.tech'),
		},
		{
			id: 'itresan',
			name: t('news.feed.itresan'),
			url: 'https://itresan.com/feed/',
			category: t('news.category.tech'),
		},
		{
			id: 'pedal',
			name: t('news.feed.pedal'),
			url: 'https://www.pedal.ir/feed/',
			category: t('news.category.tech'),
		},
		{
			id: 'varzesh3',
			name: t('news.feed.varzesh3'),
			url: 'https://www.varzesh3.com/rss/all',
			category: t('news.category.sport'),
		},
		{
			id: 'tejaratnews',
			name: t('news.feed.tejaratnews'),
			url: 'https://tejaratnews.com/feed',
			category: t('news.category.economy'),
		},
		{
			id: 'donya-e-eqtesad',
			name: t('news.feed.donyaEEqtesad'),
			url: 'https://donya-e-eqtesad.com/fa/rss/allnews',
			category: t('news.category.economy'),
		},
		{
			id: 'khabaronline',
			name: t('news.feed.khabaronline'),
			url: 'https://www.khabaronline.ir/rss',
			category: t('news.category.general'),
		},
		{
			id: 'isna',
			name: t('news.feed.isna'),
			url: 'https://www.isna.ir/rss',
			category: t('news.category.general'),
		},
		{
			id: 'asriran',
			name: t('news.feed.asriran'),
			url: 'https://www.asriran.com/fa/rss/allnews',
			category: t('news.category.general'),
		},
		{
			id: 'tabnak',
			name: t('news.feed.tabnak'),
			url: 'https://www.tabnak.ir/fa/rss/allnews',
			category: t('news.category.general'),
		},
		{
			id: 'fararu',
			name: t('news.feed.fararu'),
			url: 'https://fararu.com/fa/rss/allnews',
			category: t('news.category.general'),
		},
		{
			id: 'entekhab',
			name: t('news.feed.entekhab'),
			url: 'https://www.entekhab.ir/fa/rss/allnews',
			category: t('news.category.general'),
		},
		{
			id: 'mehrnews',
			name: t('news.feed.mehrnews'),
			url: 'https://www.mehrnews.com/rss',
			category: t('news.category.general'),
		},
	]
}

export const useGetAvailableRssFeeds = () => {
	return useQuery<AvailableRssFeed[]>({
		queryKey: newsKeys.feeds,
		queryFn: getAvailableRssFeeds,
		initialData: getFallbackAvailableFeeds,
		staleTime: 1000 * 60 * 60,
	})
}

async function getAvailableRssFeeds(): Promise<AvailableRssFeed[]> {
	try {
		const client = getMainClient()
		const { data } = await client.get<AvailableRssFeed[]>('/news/feeds')
		if (Array.isArray(data) && data.length > 0) {
			return data
		}
		return getFallbackAvailableFeeds()
	} catch {
		return getFallbackAvailableFeeds()
	}
}
