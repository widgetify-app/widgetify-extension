import { COMBO_TABS, DEFAULT_COMBO_TAB } from '../constants'
import type { ComboTabType } from '../types'

export function normalizeComboTab(stored?: string | null): ComboTabType {
	if (!stored) return DEFAULT_COMBO_TAB

	return COMBO_TABS.includes(stored as ComboTabType)
		? (stored as ComboTabType)
		: DEFAULT_COMBO_TAB
}
