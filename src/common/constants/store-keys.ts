import type { WidgetItem } from '@/features/widgets/utils/layout-engine/types'
import type { Bookmark } from '@/features/widgets/bookmark/types'
import type { PetSettings } from '@/features/widgets/pet/types'
import type { ComboTabType } from '@/features/widgets/combo-widget/types'
import type { YadkarTab } from '@/features/widgets/yadkar/types'
import type { WigiNewsSetting } from '@/features/widgets/news/types'
import type {
	PomodoroSession,
	PomodoroSettings,
} from '@/features/widgets/tools/pomodoro/types'
import type { ToolsTabType } from '@/features/widgets/tools/types'
import type {
	FetchedForecast,
	FetchedWeather,
	WeatherSettings,
} from '@/features/widgets/weather/types'
import type { ClockSettings } from '@/features/widgets/clock/types'
import type { ExtensionConfigResponse } from '@/services/config-data/config-data.interface'
import type { FetchedCurrency } from '@/services/hooks/currency/get-currency-by-code.hook'
import type { RecommendedSite, TrendItem } from '@/services/hooks/trends/get-trends.hook'
import type { UserProfile } from '@/services/hooks/user/user-service.hook'
import type { StoredWallpaper, Wallpaper } from '../wallpaper.interface'

export interface StorageKV {
	currencies: string[]
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
	storedWidgets: import('@/features/widgets/utils/layout-engine/types').StoredWidget[]
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
