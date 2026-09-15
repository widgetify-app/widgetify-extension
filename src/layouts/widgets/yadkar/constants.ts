import type { YadkarTab } from './types'

export const DEFAULT_YADKAR_TAB: YadkarTab = 'todos'

export const YADKAR_TABS: YadkarTab[] = ['todos', 'notes', 'habits']

export const YADKAR_TAB_LABELS: Record<YadkarTab, string> = {
	todos: 'تسک‌ها',
	notes: 'یادداشت',
	habits: 'عادت‌ها (بتا)',
}

export const LEGACY_YADKAR_TABS: Record<string, YadkarTab> = {
	rabbit: 'habits',
}
