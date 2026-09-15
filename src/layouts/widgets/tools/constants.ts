import type { IconName } from '@/icons/types'
import type { ToolsTabType } from './types'

export const DEFAULT_TOOLS_TAB: ToolsTabType = 'pomodoro'

export const TOOLS_TABS: {
	id: ToolsTabType
	label: string
	compactLabel: string
	icon: IconName
}[] = [
	{ id: 'pomodoro', label: 'پومودورو', compactLabel: 'پومودورو', icon: 'timer' },
	{
		id: 'religious-time',
		label: 'اوقات شرعی',
		compactLabel: 'اوقات شرعی',
		icon: 'mosque',
	},
	{
		id: 'currency-converter',
		label: 'تبدیل',
		compactLabel: 'تبدیل ارز',
		icon: 'currency',
	},
]

export const TOOLS_TAB_TITLES: Record<ToolsTabType, string> = {
	pomodoro: 'تایمر پومودورو',
	'religious-time': 'اوقات شرعی',
	'currency-converter': 'تبدیل ارز',
}
