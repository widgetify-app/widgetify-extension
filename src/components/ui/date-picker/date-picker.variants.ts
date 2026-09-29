import { cva } from 'class-variance-authority'

export const datePickerVariants = cva(
	'bg-surface border border-surface-3 rounded-2xl p-3',
	{
		variants: {
			size: {
				sm: 'w-64',
				lg: 'w-full',
			},
		},
		defaultVariants: {
			size: 'sm',
		},
	}
)

export const datePickerDayVariants = cva(
	[
		'relative p-0 rounded-full transition-ui cursor-pointer mx-auto',
		'flex items-center justify-center hover:scale-110 hover:shadow-sm',
		'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none',
	],
	{
		variants: {
			size: {
				sm: 'h-6 w-6 text-xs',
				lg: 'h-9 w-9 text-sm',
			},
		},
		defaultVariants: {
			size: 'sm',
		},
	}
)
