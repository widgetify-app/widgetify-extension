import { t } from '@/common/i18n'
import type { ComboTabType } from './types'

export const DEFAULT_COMBO_TAB: ComboTabType = 'currency'

export const COMBO_TAB_LIST: {
	id: ComboTabType
	label: string
}[] = [
	{
		id: 'currency',
		label: t('widgets.combo.tab.currency'),
	},
	{
		id: 'news',
		label: t('widgets.combo.tab.news'),
	},
]

export const COMBO_TABS: ComboTabType[] = COMBO_TAB_LIST.map((tab) => tab.id)
