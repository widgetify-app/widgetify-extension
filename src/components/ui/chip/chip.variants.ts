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
	],
	{
		variants: {
			selected: {
				true: ['bg-primary', 'border-primary', 'text-primary-content'],
				false: [
					'bg-base-100',
					'border-base-300/30',
					'text-muted',
					'hover:border-primary/30',
				],
			},
		},
		defaultVariants: {
			selected: false,
		},
	}
)

export type ChipVariant = typeof chipVariants
