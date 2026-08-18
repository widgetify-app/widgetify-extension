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
				small: ['py-1', 'px-2', 'text-[10px]'],
				medium: ['py-2', 'px-2', 'text-[10px]'],
				large: ['py-3', 'px-2', 'text-sm'],
			},
			tabMode: {
				simple: [],
				advanced: [],
			},
			active: {
				true: [
					'text-base-content/60',
					'text-shadow-2xs',
					'font-bold',
					'text-icy',
				],
				false: [
					'text-base-content/50',
					'hover:bg-base-300',
					'hover:text-base-content/30',
				],
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

export type TabTriggerVariant = typeof tabTriggerVariants
