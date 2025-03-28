import type { SelectedCity } from '@/context/weather.context'
import type { Todo } from '@/layouts/calendar/interface/todo.interface'
import type { Bookmark } from '@/layouts/search/bookmarks/types/bookmark.types'
import type { FetchedCurrency } from '@/services/getMethodHooks/getCurrencyByCode.hook'
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
}
