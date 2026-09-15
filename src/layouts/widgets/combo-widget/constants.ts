import type { IconName } from '@/icons/types'
import type { ComboTabType } from './types'

export const DEFAULT_COMBO_TAB: ComboTabType = 'currency'

export const COMBO_TAB_LIST: {
	id: ComboTabType
	label: string
	icon: IconName
}[] = [
	{
		id: 'currency',
		label: 'ارزها',
		icon: 'currency',
	},
	{
		id: 'news',
		label: 'اخبار',
		icon: 'outlineNewspaper',
	},
]

export const COMBO_TABS: ComboTabType[] = COMBO_TAB_LIST.map((tab) => tab.id)

export const COMBO_TAB_LABELS: Record<ComboTabType, string> = Object.fromEntries(
	COMBO_TAB_LIST.map((tab) => [tab.id, tab.label])
) as Record<ComboTabType, string>
