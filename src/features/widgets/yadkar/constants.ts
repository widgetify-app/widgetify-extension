import { t } from '@/common/i18n'
import type { YadkarTab } from './types'

export const DEFAULT_YADKAR_TAB: YadkarTab = 'todos'

export const YADKAR_TAB_LIST: { id: YadkarTab; label: string }[] = [
	{ id: 'todos', label: t('widgets.yadkar.tab.todos') },
	{ id: 'notes', label: t('widgets.yadkar.tab.notes') },
	{ id: 'habits', label: t('widgets.yadkar.tab.habits') },
]

export const YADKAR_TABS: YadkarTab[] = YADKAR_TAB_LIST.map((tab) => tab.id)

export const YADKAR_TAB_LABELS: Record<YadkarTab, string> = Object.fromEntries(
	YADKAR_TAB_LIST.map((tab) => [tab.id, tab.label])
) as Record<YadkarTab, string>

export const LEGACY_YADKAR_TABS: Record<string, YadkarTab> = {
	rabbit: 'habits',
}
