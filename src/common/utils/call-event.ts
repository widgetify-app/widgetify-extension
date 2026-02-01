import type { CurrencyColorMode } from '@/context/currency.context'
import type { Theme } from '@/context/theme.context'
import type { Bookmark } from '@/layouts/bookmark/types/bookmark.types'
import type { SyncTarget } from '@/layouts/navbar/sync/sync'
import type { PetTypes } from '@/layouts/widgetify-card/pets/pet.context'
import type { WigiNewsSetting } from '@/layouts/widgets/news/rss.interface'
import type { WeatherSettings } from '@/layouts/widgets/weather/weather.interface'
import type { ClockSettings } from '@/layouts/widgets/wigiPad/clock-display/clock-setting.interface'
import type { WigiPadDateSetting } from '@/layouts/widgets/wigiPad/date-display/date-setting.interface'
import type { WidgetTabKeys } from '@/layouts/widgets-settings/constant/tab-keys'
import type { StoredWallpaper } from '../wallpaper.interface'
import type { Todo } from '@/services/hooks/todo/todo.interface'
import type { FontFamily } from '@/context/appearance.context'
import React from 'react'

export interface EventName {
	startSync: SyncTarget
	openSettings: 'account' | 'wallpapers' | 'general' | null
	todosChanged: Todo[]
	wallpaperChanged: StoredWallpaper
	openWidgetsSettings: { tab: WidgetTabKeys | null }
	bookmarksChanged: Bookmark[]
	updatedPetSettings: {
		petName?: string
		petType: PetTypes
	}
	updatedPetState: boolean
	theme_change: Theme
	auth_logout: null
	browser_title_change: {
		id: string
		name: string
		template: string
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
	openProfile: null
	openMarketModal: null
	font_change: FontFamily
	close_all_modals: null
	openWizardModal: null
	add_to_notifications: { id: string; node: React.ReactNode }
	remove_from_notifications: { id: string; ttl?: number }
	go_to_page: 'explorer' | 'home'
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
