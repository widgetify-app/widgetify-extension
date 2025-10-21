import type { CurrencyColorMode } from '@/context/currency.context'
import type { SelectedCity } from '@/context/general-setting.context'
import type { Theme } from '@/context/theme.context'
import type { TodoOptions } from '@/context/todo.context'
import type { WidgetItem } from '@/context/widget-visibility.context'
import type { FavoriteSite } from '@/entrypoints/sidepanel/layouts/favorite/favorite.types'
import type { Bookmark } from '@/layouts/bookmark/types/bookmark.types'
import type { VerticalTabsSettings } from '@/layouts/setting/tabs/vertical-tabs/vertical-tabs-settings'
import type { PetSettings } from '@/layouts/widgetify-card/pets/pet.context'
import type { Todo } from '@/layouts/widgets/calendar/interface/todo.interface'
import type { ComboTabType } from '@/layouts/widgets/comboWidget/combo-widget.layout'
import type { FilterSortState } from '@/layouts/widgets/news/components/news-filter-sort'
import type { WigiNewsSetting } from '@/layouts/widgets/news/news.interface'
import type {
	PomodoroSession,
	PomodoroSettings,
} from '@/layouts/widgets/tools/pomodoro/types'
import type { ToolsTabType } from '@/layouts/widgets/tools/tools.layout'
import type {
	FetchedForecast,
	FetchedWeather,
	WeatherSettings,
} from '@/layouts/widgets/weather/weather.interface'
import type { ClockSettings } from '@/layouts/widgets/wigiPad/clock-display/clock-setting.interface'
import type { WigiPadDateSetting } from '@/layouts/widgets/wigiPad/date-display/date-setting.interface'
import type { ExtensionConfigResponse } from '@/services/config-data/config_data-api'
import type { FetchedCurrency } from '@/services/hooks/currency/getCurrencyByCode.hook'
import type { NewsResponse } from '@/services/hooks/news/getNews.hook'
import type { RecommendedSite, TrendItem } from '@/services/hooks/trends/getTrends'
import type { UserProfile } from '@/services/hooks/user/userService.hook'
import type { FetchedYouTubeProfile } from '@/services/hooks/youtube/getYouTubeProfile.hook'
import type { StoredWallpaper, Wallpaper } from '../wallpaper.interface'

export interface StorageKV {
	currencies: string[]
	currencyColorMode: CurrencyColorMode
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
	hasSeenTour: boolean
	[key: `currency:${string}`]: FetchedCurrency
	gaClientId: { ga_client_id: string }
	theme: Theme
	lastVersion: string
	forecastWeather: FetchedForecast[]
	auth_token: string | undefined
	refresh_token: string | null
	profile: UserProfile
	activeWidgets: WidgetItem[]
	news: NewsResponse & { isCached?: boolean }
	search_trends: TrendItem[]
	recommended_sites: RecommendedSite[]
	deletedTodos: Todo[]
	rss_news_state: WigiNewsSetting
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
	wigiPadDate: WigiPadDateSetting
	configData: ExtensionConfigResponse
	toolsTab: ToolsTabType
	comboTabs: ComboTabType
	pomodoro_session: PomodoroSession | null
	pomodoro_settings: PomodoroSettings | null
	seenWidgetSettings_1: boolean
	seenTodoNewViewMode: boolean
	hasSeenFooterDisableHint: boolean
	verticalTabsSettings: VerticalTabsSettings
	favoriteSites: FavoriteSite[]
}
