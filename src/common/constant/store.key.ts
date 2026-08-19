import type { CurrencyColorMode } from '@/context/currency.context'
import type { WidgetItem } from '@/context/widget-visibility.context'
import type { Bookmark } from '@/layouts/bookmark/types/bookmark.types'
import type { PetSettings } from '@/layouts/widgetify-card/pets/pet.context'
import type { ComboTabType } from '@/layouts/widgets/combo-widget/combo-widget.layout'
import type { WigiNewsSetting } from '@/layouts/widgets/news/rss.interface'
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
import type { ClockSettings } from '@/layouts/widgets/wigi-pad/clock-display/clock-setting.interface'
import type { WigiPadDateSetting } from '@/layouts/widgets/wigi-pad/date-display/date-setting.interface'
import type { ExtensionConfigResponse } from '@/services/config-data/config_data-api'
import type { FetchedCurrency } from '@/services/hooks/currency/get-currency-by-code.hook'
import type { RecommendedSite, TrendItem } from '@/services/hooks/trends/get-trends'
import type { UserProfile } from '@/services/hooks/user/user-service.hook'
import type { StoredWallpaper, Wallpaper } from '../wallpaper.interface'
import type { Todo } from '@/services/hooks/todo/todo.interface'

export interface StorageKV {
	currencies: string[]
	currencyColorMode: CurrencyColorMode
	hasShownPwaModal: boolean
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
	theme: string
	lastVersion: string
	forecastWeather: FetchedForecast[]
	auth_token: string | undefined
	refresh_token: string | null
	profile: UserProfile
	activeWidgets: WidgetItem[]
	storedWidgets: import('@/layouts/widgets/layout-engine/types').StoredWidget[]
	widgetLayoutMigrationVersion: number
	search_trends: TrendItem[]
	recommended_sites: RecommendedSite[]
	deletedTodos: Todo[]
	analyticsSession: any
	notes_data: {
		body: string
		createdAt: number
		id: string
		title: string
		updatedAt: number
	}[]
	calendarDrawerState: boolean
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
	seenTodoNewViewMode: boolean
	hasSeenFooterDisableHint: boolean
	rssOptions: WigiNewsSetting
	browserTitle: {
		id: string
		template: string
		name: string
	}
	pendingOrders: any
	petState: boolean
	showNewBadgeForReOrderWidgets: boolean
	navbarVisible: boolean
	todoFilter: string
	todoSort: string
	[key: `removed_notification_${string}`]: string
	selected_engine: string | null
	widget_tab: string
	yadkar_tab: string
	notifications: any
}
