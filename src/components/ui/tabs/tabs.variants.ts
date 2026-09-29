import { cva } from 'class-variance-authority'

export const tabTriggerVariants = cva(
	[
		'relative',
		'z-10',
		'flex',
		'items-center',
		'justify-center',
		'gap-1',
		'cursor-pointer',
		'rounded-xl',
		'transition-colors',
		'duration-200',
	],
	{
		variants: {
			size: {
				small: ['py-1', 'px-2', 'text-3xs'],
				medium: ['py-2', 'px-2', 'text-3xs'],
				large: ['py-3', 'px-2', 'text-sm'],
			},
			tabMode: {
				simple: [],
				advanced: [],
			},
			active: {
				true: ['text-fg-muted', 'font-bold'],
				false: ['text-fg-faint', 'hover:bg-surface-3'],
			},
		},
		compoundVariants: [
			// Simple mode gives every tab the wide basis; advanced mode only the
			// active one, so inactive tabs shrink to make room for it.
			{ tabMode: 'simple', class: 'flex-2' },
			{ tabMode: 'advanced', active: true, class: 'flex-2' },
			{ tabMode: 'advanced', active: false, class: 'flex-1' },
		],
		defaultVariants: {
			size: 'medium',
			tabMode: 'advanced',
			active: false,
		},
	}
)
