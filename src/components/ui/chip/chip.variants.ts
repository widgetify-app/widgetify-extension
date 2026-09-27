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
				true: ['bg-brand', 'border-brand', 'text-on-brand'],
				false: [
					'bg-surface',
					'bg-glass',
					'border-surface-3',
					'text-fg-muted',
					'enabled:hover:border-brand-fill-2',
					'disabled:opacity-80',
				],
			},
		},
		defaultVariants: {
			selected: false,
		},
	}
)
