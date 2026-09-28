import { cva } from 'class-variance-authority'

export const datePickerVariants = cva(
	'bg-base-100 border border-base-300 rounded-xl p-3',
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
		'relative p-0 rounded-2xl transition-all cursor-pointer mx-auto',
		'flex items-center justify-center hover:scale-110 hover:shadow',
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
