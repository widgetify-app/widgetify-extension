import type { Bookmark } from '@/services/bookmark/bookmark.interface'
import type {
	FetchedForecast,
	FetchedWeather,
} from '@/services/weather/weather.interface'
import type { ExtensionConfigResponse } from '@/services/config-data/config-data.interface'
import type { FetchedCurrency } from '@/services/currency/get-currency-by-code.hook'
import type { RecommendedSite, TrendItem } from '@/services/trends/get-trends.hook'
import type { UserProfile } from '@/services/user/user-service.hook'
import type { StoredWallpaper, Wallpaper } from '../types/wallpaper.interface'

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
	hasSeenTour: boolean
	[key: `currency:${string}`]: FetchedCurrency
	gaClientId: { ga_client_id: string }
	theme: string
	lastVersion: string
	forecastWeather: FetchedForecast[]
	auth_token: string | undefined
	refresh_token: string | null
	profile: UserProfile
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
	configData: ExtensionConfigResponse
	seenWidgetSettings_1: boolean
	hasSeenFooterDisableHint: boolean
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
	notifications: any
}
