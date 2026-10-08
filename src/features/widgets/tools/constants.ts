import { t } from '@/common/i18n'
import type { ToolsTabType } from './types'

export const DEFAULT_TOOLS_TAB: ToolsTabType = 'pomodoro'

export const TOOLS_TABS: { id: ToolsTabType; label: string }[] = [
	{ id: 'pomodoro', label: t('widgets.tools.tab.pomodoro') },
	{ id: 'religious-time', label: t('widgets.tools.tab.religious') },
	{ id: 'currency-converter', label: t('widgets.tools.tab.convert') },
]

export const CONVERTER_DEFAULT_PAIR = {
	from: { code: 'EUR', symbol: '€' },
	to: { code: 'USD', symbol: '$' },
}

export const TOOLS_TAB_TITLES: Record<ToolsTabType, string> = {
	pomodoro: t('widgets.tools.tab.pomodoroTitle'),
	'religious-time': t('widgets.tools.tab.religious'),
	'currency-converter': t('widgets.tools.tab.currencyTitle'),
}
