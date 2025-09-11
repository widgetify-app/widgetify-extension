import type { Theme } from '@/context/theme.context'
import type { Bookmark } from '@/layouts/bookmark/types/bookmark.types'
import type { SyncTarget } from '@/layouts/navbar/sync/sync'
import type { PetTypes } from '@/layouts/widgetify-card/pets/pet.context'
import type { Todo } from '@/layouts/widgets/calendar/interface/todo.interface'
import type { ClockSettings } from '@/layouts/widgets/wigiPad/clock-display/clock-setting.interface'
import type { WigiPadDateSetting } from '@/layouts/widgets/wigiPad/date-display/date-setting.interface'
import type { StoredWallpaper } from '../wallpaper.interface'

export interface EventName {
	startSync: SyncTarget
	openSettings: 'account' | 'wallpapers' | null
	todosChanged: Todo[]
	wallpaperChanged: StoredWallpaper
	openWidgetSettings: null
	bookmarksChanged: Bookmark[]
	updatedPetSettings: {
		enablePets?: boolean
		petName?: string
		petType: PetTypes
	}
	themeChanged: Theme
	auth_logout: null

	// setting keys
	wigiPadDateSettingsChanged: WigiPadDateSetting
	wigiPadClockSettingsChanged: ClockSettings
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
