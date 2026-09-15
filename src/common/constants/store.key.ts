import type { CurrencyColorMode } from '@/context/currency.context'
import type { WidgetItem } from '@/context/widget-visibility.context'
import type { Bookmark } from '@/layouts/bookmark/types/bookmark.types'
import type { PetSettings } from '@widget/pet/types'
import type { ComboTabType } from '@widget/combo-widget/types'
import type { YadkarTab } from '@widget/yadkar/types'
import type { WigiNewsSetting } from '@widget/news/rss.interface'
import type {
	PomodoroSession,
	PomodoroSettings,
} from '@widget/tools/pomodoro/types'
import type { ToolsTabType } from '@widget/tools/types'
import type {
	FetchedForecast,
	FetchedWeather,
	WeatherSettings,
} from '@widget/weather/weather.interface'
import type { ClockSettings } from '@widget/clock/clock-setting.interface'
import type { WigiPadDateSetting } from '@widget/wigi-pad/date-display/date-setting.interface'
import type { ExtensionConfigResponse } from '@/services/config-data/config-data.api'
import type { FetchedCurrency } from '@/services/hooks/currency/get-currency-by-code.hook'
import type { RecommendedSite, TrendItem } from '@/services/hooks/trends/get-trends.hook'
import type { UserProfile } from '@/services/hooks/user/user-service.hook'
import type { StoredWallpaper, Wallpaper } from '../wallpaper.interface'

export interface StorageKV {
	currencies: string[]
	currencyColorMode: CurrencyColorMode
	hasShownPwaModal: boolean
	currentWeather: FetchedWeather
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
	theme: string
	lastVersion: string
	forecastWeather: FetchedForecast[]
	auth_token: string | undefined
	refresh_token: string | null
	profile: UserProfile
	activeWidgets: WidgetItem[]
	storedWidgets: import('@widget/layout-engine/types').StoredWidget[]
	widgetLayoutMigrationVersion: number
	search_trends: TrendItem[]
	recommended_sites: RecommendedSite[]
	analyticsSession: any
	notes_data: {
		body: string
		createdAt: number
		id: string
		title: string
		updatedAt: number
	}[]
	recent_searches: any
	pets: PetSettings
	clock: ClockSettings
	wigiPadDate: WigiPadDateSetting
	configData: ExtensionConfigResponse
	toolsTab: ToolsTabType
	comboTabs: ComboTabType
	pomodoro_session: PomodoroSession | null
	pomodoro_settings: PomodoroSettings | null
	seenWidgetSettings_1: boolean
	hasSeenFooterDisableHint: boolean
	rssOptions: WigiNewsSetting
	browserTitle: {
		id: string
		template: string
		name: string
	}
	pendingOrders: any
	showNewBadgeForReOrderWidgets: boolean
	navbarVisible: boolean
	todoFilter: string
	todoSort: string
	[key: `removed_notification_${string}`]: string
	selected_engine: string | null
	widget_tab: string
	yadkar_tab: YadkarTab
	notifications: any
}
