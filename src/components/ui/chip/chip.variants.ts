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
		'focus-visible:focus-ring',
	],
	{
		variants: {
			selected: {
				true: ['bg-primary', 'border-primary', 'text-primary-content'],
				false: [
					'bg-widget',
					'bg-glass',
					'border-faint',
					'text-content',
					'enabled:hover:border-primary/30',
					'disabled:opacity-(--disabled-opacity)',
				],
			},
		},
		defaultVariants: {
			selected: false,
		},
	}
)

export type ChipVariant = typeof chipVariants
