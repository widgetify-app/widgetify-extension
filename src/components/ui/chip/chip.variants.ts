import { cva } from 'class-variance-authority'

export const chipVariants = cva(
	[
		'px-4',
		'py-2',
		'cursor-pointer',
		'rounded-full',
		'text-xs',
		'font-bold',
		'border-2',
		'transition-all',
		'active:scale-95',
		'disabled:cursor-not-allowed',
		'disabled:active:scale-none!',
	],
	{
		variants: {
			selected: {
				true: ['bg-primary', 'border-primary', 'text-white'],
				false: [
					'bg-base-100',
					'bg-glass',
					'border-base-300/30',
					'text-base-content/80',
					'enabled:hover:border-primary/30',
					'disabled:opacity-80',
				],
			},
		},
		defaultVariants: {
			selected: false,
		},
	}
)

export type ChipVariant = typeof chipVariants
