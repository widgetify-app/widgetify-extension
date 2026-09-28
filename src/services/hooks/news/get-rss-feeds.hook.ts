import { useQuery } from '@tanstack/react-query'
import { getMainClient } from '@/services/api'

export interface AvailableRssFeed {
	id: string
	name: string
	url: string
	category?: string
}

export const FALLBACK_AVAILABLE_FEEDS: AvailableRssFeed[] = [
	{
		id: 'zoomit',
		name: 'زومیت',
		url: 'https://www.zoomit.ir/feed/',
		category: 'فناوری',
	},
	{
		id: 'digiato',
		name: 'دیجیاتو',
		url: 'https://digiato.com/feed/',
		category: 'فناوری',
	},
	{
		id: 'digikala-mag',
		name: 'دیجی‌کالا مگ',
		url: 'https://www.digikala.com/mag/feed/',
		category: 'فناوری',
	},
	{
		id: 'zoomg',
		name: 'زومجی',
		url: 'https://www.zoomg.ir/feed/',
		category: 'فناوری',
	},
	{
		id: 'itresan',
		name: 'آی‌تی‌رسان',
		url: 'https://itresan.com/feed/',
		category: 'فناوری',
	},
	{
		id: 'pedal',
		name: 'پدال',
		url: 'https://www.pedal.ir/feed/',
		category: 'فناوری',
	},
	{
		id: 'varzesh3',
		name: 'ورزش ۳',
		url: 'https://www.varzesh3.com/rss/all',
		category: 'ورزش',
	},
	{
		id: 'tejaratnews',
		name: 'تجارت‌نیوز',
		url: 'https://tejaratnews.com/feed',
		category: 'اقتصاد',
	},
	{
		id: 'donya-e-eqtesad',
		name: 'دنیای اقتصاد',
		url: 'https://donya-e-eqtesad.com/fa/rss/allnews',
		category: 'اقتصاد',
	},
	{
		id: 'khabaronline',
		name: 'خبرآنلاین',
		url: 'https://www.khabaronline.ir/rss',
		category: 'عمومی',
	},
	{
		id: 'isna',
		name: 'ایسنا',
		url: 'https://www.isna.ir/rss',
		category: 'عمومی',
	},
	{
		id: 'asriran',
		name: 'عصر ایران',
		url: 'https://www.asriran.com/fa/rss/allnews',
		category: 'عمومی',
	},
	{
		id: 'tabnak',
		name: 'تابناک',
		url: 'https://www.tabnak.ir/fa/rss/allnews',
		category: 'عمومی',
	},
	{
		id: 'fararu',
		name: 'فرارو',
		url: 'https://fararu.com/fa/rss/allnews',
		category: 'عمومی',
	},
	{
		id: 'entekhab',
		name: 'انتخاب',
		url: 'https://www.entekhab.ir/fa/rss/allnews',
		category: 'عمومی',
	},
	{
		id: 'mehrnews',
		name: 'مهر',
		url: 'https://www.mehrnews.com/rss',
		category: 'عمومی',
	},
]

export const useGetAvailableRssFeeds = () => {
	return useQuery<AvailableRssFeed[]>({
		queryKey: ['getAvailableRssFeeds'],
		queryFn: getAvailableRssFeeds,
		initialData: FALLBACK_AVAILABLE_FEEDS,
		staleTime: 1000 * 60 * 60,
	})
}

export async function getAvailableRssFeeds(): Promise<AvailableRssFeed[]> {
	try {
		const client = getMainClient()
		const { data } = await client.get<AvailableRssFeed[]>('/news/feeds')
		if (Array.isArray(data) && data.length > 0) {
			return data
		}
		return FALLBACK_AVAILABLE_FEEDS
	} catch {
		return FALLBACK_AVAILABLE_FEEDS
	}
}
