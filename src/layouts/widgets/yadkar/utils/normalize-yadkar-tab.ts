import { DEFAULT_YADKAR_TAB, LEGACY_YADKAR_TABS, YADKAR_TABS } from '../constants'
import type { YadkarTab } from '../types'

export function normalizeYadkarTab(stored?: string | null): YadkarTab {
	if (!stored) return DEFAULT_YADKAR_TAB

	const migrated = LEGACY_YADKAR_TABS[stored] ?? stored

	return YADKAR_TABS.includes(migrated as YadkarTab)
		? (migrated as YadkarTab)
		: DEFAULT_YADKAR_TAB
}
