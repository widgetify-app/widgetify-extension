import type { TodoOptions } from '@/context/todo.context'
import type { SelectedCity } from '@/context/weather.context'
import type { WidgetItem } from '@/context/widget-visibility.context'
import type { Bookmark } from '@/layouts/bookmark/types/bookmark.types'
import type { PetSettings } from '@/layouts/widgetify-card/pets/pet.context'
import type { Todo } from '@/layouts/widgets/calendar/interface/todo.interface'
import type { FilterSortState } from '@/layouts/widgets/news/components/news-filter-sort'
import type { RssNewsState } from '@/layouts/widgets/news/news.interface'
import type {
	ClockSettings,
	ClockType,
} from '@/layouts/widgets/wigiPad/clock-display/clock-display'
import type { FetchedCurrency } from '@/services/hooks/currency/getCurrencyByCode.hook'
import type { NewsResponse } from '@/services/hooks/news/getNews.hook'
import type { RecommendedSite, TrendItem } from '@/services/hooks/trends/getTrends'
import type { UserProfile } from '@/services/hooks/user/userService.hook'
import type {
	FetchedForecast,
	FetchedWeather,
	WeatherSettings,
} from '@/services/hooks/weather/weather.interface'
import type { FetchedYouTubeProfile } from '@/services/hooks/youtube/getYouTubeProfile.hook'
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
	[key: `currency:${string}`]: FetchedCurrency
	gaClientId: { ga_client_id: string }
	theme: 'light' | 'dark' | 'glass'
	lastVersion: string
	forecastWeather: FetchedForecast[]
	auth_token: string | undefined
	profile: UserProfile
	activeWidgets: WidgetItem[]
	news: NewsResponse & { isCached?: boolean }
	search_trends: TrendItem[]
	recommended_sites: RecommendedSite[]
	deletedTodos: Todo[]
	rss_news_state: RssNewsState
	news_filter_sort_state: FilterSortState
	analyticsSession: any
	enable_sync: boolean
	notes_data: {
		body: string
		createdAt: number
		id: string
		title: string
		updatedAt: number
	}[]
	calendarDrawerState: boolean
	pets: PetSettings
	todoOptions: TodoOptions
	youtubeSettings: {
		username: string | null
		subscriptionStyle: 'short' | 'long'
	}
	youtubeProfile: FetchedYouTubeProfile & { isCached?: boolean }
	clock: ClockSettings
}
