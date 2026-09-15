import type { CurrencyColorMode } from '@/context/currency.context'
import type { Bookmark } from '@/layouts/bookmark/types/bookmark.types'
import type { PetBackgroundId, PetTypes } from '@widget/pet/types'
import type { WigiNewsSetting } from '@widget/news/rss.interface'
import type { WeatherSettings } from '@widget/weather/weather.interface'
import type { ClockSettings } from '@widget/clock/clock-setting.interface'
import type { WigiPadDateSetting } from '@widget/wigi-pad/date-display/date-setting.interface'
import type { WidgetTabKeys } from '@/layouts/widgets-settings/tab-keys'
import type { StoredWallpaper, Wallpaper } from '../wallpaper.interface'
import type { Todo } from '@/services/hooks/todo/todo.interface'
import type { Page } from '@/context/page.context'

export interface EventName {
	openSettings:
		| 'account'
		| 'profile'
		| 'platforms'
		| 'vip'
		| 'pro'
		| 'tasks'
		| 'friends'
		| 'general'
		| 'access'
		| 'appearance'
		| 'wallpapers'
		| 'shortcuts'
		| 'about'
		| null
	todosChanged: Todo[]
	wallpaper_change: StoredWallpaper
	custom_wallpaper_sync: Wallpaper | null
	openWidgetsSettings: {
		tab: WidgetTabKeys | null
		instanceId?: string
		size?: { w: number; h: number }
	}
	bookmarksChanged: Bookmark[]
	updatedPetSettings: {
		instanceId?: string
		petName?: string
		petType: PetTypes
		background?: PetBackgroundId
	}
	theme_change: {
		theme: string
		sync: boolean
	}
	auth_logout: null
	browser_title_change: {
		id: string
		name: string
		template: string
		sync: boolean
	}

	// setting keys
	wigiPadDateSettingsChanged: WigiPadDateSetting
	wigiPadClockSettingsChanged: ClockSettings
	currencies_updated: {
		currencies: string[]
		colorMode: CurrencyColorMode
	}
	wigiNewsSettingsChanged: WigiNewsSetting
	weatherSettingsChanged: WeatherSettings
	closeAllDropdowns: null
	openProfile?: 'friends' | 'platforms' | 'vip' | 'pro'
	openMarketModal: null
	font_change: {
		font: string
		sync: boolean
	}
	ui_change: string
	close_all_modals: null
	openWizardModal: null
	add_to_notifications: { id: string; node: React.ReactNode }
	remove_from_notifications: { id: string; ttl?: number }
	go_to_page: Page
	market_change_tab: string
	open_require_auth_modal: null
	toggle_miniApp_fullScreen: boolean
	close_friends_bottomSheet: null
	resetWallpaper: null
	openAddCustomWidgetModal:
		| { instanceId?: string; widgetId?: string }
		| null
		| undefined
	openPresetLayoutsModal: null
	cancelWidgetDrag: null
}

export function callEvent<K extends keyof EventName>(eventName: K, data?: EventName[K]) {
	const event = new CustomEvent(eventName, { detail: data })
	window.dispatchEvent(event)
}

/**
 * Listens to a custom event on the window object.
 * @returns {function} - A function to remove the event listener.
 */
export function listenEvent<K extends keyof EventName>(
	eventName: K,
	callback: (data: EventName[K]) => void
): () => void {
	const handler = (event: CustomEvent<EventName[K]>) => {
		callback(event.detail)
	}

	window.addEventListener(eventName, handler as EventListener)

	return () => {
		window.removeEventListener(eventName, handler as EventListener)
	}
}
