import { cva, type VariantProps } from 'class-variance-authority'

export const tileVariants = cva(
	[
		'group relative flex flex-col min-w-0 overflow-hidden',
		'rounded-2xl border bg-surface-2',
		'transition-ui',
	],
	{
		variants: {
			selected: {
				true: 'border-brand ring-2 ring-brand-fill-2',
				false: 'border-surface-3 hover:border-brand-muted hover:shadow-md',
			},
		},
		defaultVariants: { selected: false },
	}
)

export const tileMediaVariants = cva(
	'relative block w-full overflow-hidden bg-fill shrink-0',
	{
		variants: {
			aspect: {
				video: 'aspect-video',
				wide: 'aspect-[2/1]',
				short: 'h-20',
			},
		},
		defaultVariants: { aspect: 'video' },
	}
)

export type TileVariantProps = VariantProps<typeof tileVariants> &
	VariantProps<typeof tileMediaVariants>
