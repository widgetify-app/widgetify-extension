export const PRIORITY_BG_COLORS = {
	low: 'bg-success text-success-content',
	medium: 'bg-warning text-warning-content',
	high: 'bg-error text-error-content',
}

export const PRIORITY_OPTIONS = [
	{
		value: 'low',
		ariaLabel: 'اولویت کم',
		bgColor: PRIORITY_BG_COLORS.low,
		hoverBgColor: 'hover:bg-green-600',
	},
	{
		value: 'medium',
		ariaLabel: 'اولویت متوسط',
		bgColor: PRIORITY_BG_COLORS.medium,
		hoverBgColor: 'hover:bg-yellow-400',
	},
	{
		value: 'high',
		ariaLabel: 'اولویت مهم',
		bgColor: PRIORITY_BG_COLORS.high,
		hoverBgColor: 'hover:bg-red-500',
	},
]
