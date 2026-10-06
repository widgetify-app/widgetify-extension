import { cva } from 'class-variance-authority'

export const chipVariants = cva(
	[
		'cursor-pointer',
		'rounded-full',
		'transition-ui',
		'active:scale-95',
		'disabled:cursor-not-allowed',
		'disabled:active:scale-none!',
	],
	{
		variants: {
			selected: {
				true: '',
				false: 'disabled:opacity-80',
			},
			size: {
				md: ['px-4', 'py-2', 'text-xs', 'font-bold', 'border-2'],
				sm: [
					'inline-flex',
					'items-center',
					'h-6',
					'px-2.5',
					'text-2xs',
					'font-semibold',
				],
			},
		},
		compoundVariants: [
			{
				size: 'md',
				selected: true,
				class: ['bg-brand', 'border-brand', 'text-on-brand'],
			},
			{
				size: 'md',
				selected: false,
				class: [
					'bg-glass-surface',
					'border-surface-3',
					'text-fg-muted',
					'enabled:hover:border-brand-fill-2',
				],
			},
			{
				size: 'sm',
				selected: true,
				class: ['bg-brand-fill', 'text-brand'],
			},
			{
				size: 'sm',
				selected: false,
				class: ['bg-fill', 'text-fg-muted', 'enabled:hover:bg-fill-2'],
			},
		],
		defaultVariants: {
			selected: false,
			size: 'md',
		},
	}
)
