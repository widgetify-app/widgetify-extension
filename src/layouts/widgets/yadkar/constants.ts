import type { IconName } from '@/icons/types'
import type { YadkarTab } from './types'

export const DEFAULT_YADKAR_TAB: YadkarTab = 'todos'

export const YADKAR_TAB_LIST: { id: YadkarTab; label: string; icon: IconName }[] = [
	{ id: 'todos', label: 'تسک‌ها', icon: 'taskList' },
	{ id: 'notes', label: 'یادداشت', icon: 'notebook' },
	{ id: 'habits', label: 'عادت‌ها (بتا)', icon: 'strike' },
]

export const YADKAR_TABS: YadkarTab[] = YADKAR_TAB_LIST.map((tab) => tab.id)

export const YADKAR_TAB_LABELS: Record<YadkarTab, string> = Object.fromEntries(
	YADKAR_TAB_LIST.map((tab) => [tab.id, tab.label])
) as Record<YadkarTab, string>

export const LEGACY_YADKAR_TABS: Record<string, YadkarTab> = {
	rabbit: 'habits',
}
