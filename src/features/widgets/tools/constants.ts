import type { ToolsTabType } from './types'

export const DEFAULT_TOOLS_TAB: ToolsTabType = 'pomodoro'

export const TOOLS_TABS: { id: ToolsTabType; label: string }[] = [
	{ id: 'pomodoro', label: 'پومودورو' },
	{ id: 'religious-time', label: 'اوقات شرعی' },
	{ id: 'currency-converter', label: 'تبدیل' },
]

export const CONVERTER_DEFAULT_PAIR = {
	from: { code: 'EUR', symbol: '€' },
	to: { code: 'USD', symbol: '$' },
}

export const TOOLS_TAB_TITLES: Record<ToolsTabType, string> = {
	pomodoro: 'تایمر پومودورو',
	'religious-time': 'اوقات شرعی',
	'currency-converter': 'تبدیل ارز',
}
