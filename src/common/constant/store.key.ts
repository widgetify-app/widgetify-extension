import type { SelectedCity } from '@/context/weather.context'
import type { Bookmark } from '@/layouts/bookmark/types/bookmark.types'
import type { Todo } from '@/layouts/widgets/calendar/interface/todo.interface'
import type { RssNewsState } from '@/layouts/widgets/news/news.interface'
import type { FetchedCurrency } from '@/services/getMethodHooks/getCurrencyByCode.hook'
import type { NewsResponse } from '@/services/getMethodHooks/getNews.hook'
import type {
	RecommendedSite,
	TrendItem,
} from '@/services/getMethodHooks/trends/getTrends'
import type { UserProfile } from '@/services/getMethodHooks/user/userService.hook'
import type {
	FetchedForecast,
	FetchedWeather,
	WeatherSettings,
} from '@/services/getMethodHooks/weather/weather.interface'
import type { StoredWallpaper, Wallpaper } from '../wallpaper.interface'

export interface StorageKV {
	currencies: string[]
	hasShownPwaModal: boolean
	selectedCity: SelectedCity | null
	currentWeather: FetchedWeather
	todos: Todo[]
	wallpaper: StoredWallpaper
	customWallpaper: Wallpaper
	generalSettings: Record<string, any>
	appearance: Record<string, any>
	bookmarks: Bookmark[]
	deletedBookmarkIds: string[]
	showWelcomeModal: boolean
	weatherSettings: WeatherSettings
	todoBlurMode: boolean
	[key: `currency:${string}`]: FetchedCurrency
	gaClientId: { ga_client_id: string }
	theme: 'light' | 'dark' | 'glass'
	lastVersion: string
	forecastWeather: FetchedForecast[]
	auth_token: string | undefined
	profile: UserProfile
	widgetVisibility: any
	news: NewsResponse & { isCached?: boolean }
	search_trends: TrendItem[]
	recommended_sites: RecommendedSite[]
	deletedTodos: Todo[]
	rss_news_state: RssNewsState
	analyticsSession: any
	enable_sync: boolean
	calendarDrawerState: boolean
}
