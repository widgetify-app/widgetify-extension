import type { IconName } from '@/icons/types'
import { WidgetTabKeys } from '@/layouts/widgets-settings/tab-keys'
import type { ComboTabType } from './types'

export const DEFAULT_COMBO_TAB: ComboTabType = 'currency'

export const COMBO_TAB_LIST: {
	id: ComboTabType
	label: string
	icon: IconName
	settingsTab: WidgetTabKeys
}[] = [
	{
		id: 'currency',
		label: 'ارزها',
		icon: 'currency',
		settingsTab: WidgetTabKeys.wigiArz,
	},
	{
		id: 'news',
		label: 'اخبار',
		icon: 'outlineNewspaper',
		settingsTab: WidgetTabKeys.news_settings,
	},
]

export const COMBO_TABS: ComboTabType[] = COMBO_TAB_LIST.map((tab) => tab.id)

export const COMBO_TAB_LABELS: Record<ComboTabType, string> = Object.fromEntries(
	COMBO_TAB_LIST.map((tab) => [tab.id, tab.label])
) as Record<ComboTabType, string>
