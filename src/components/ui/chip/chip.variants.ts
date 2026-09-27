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
				true: ['bg-ds-brand', 'border-ds-brand', 'text-ds-on-brand'],
				false: [
					'bg-ds-surface',
					'bg-glass',
					'border-ds-surface-3',
					'text-ds-fg-muted',
					'enabled:hover:border-ds-brand-fill-2',
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
