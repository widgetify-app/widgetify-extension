import { cva, type VariantProps } from 'class-variance-authority'

export const proBadgeVariants = cva(
	'inline-flex items-center justify-center font-bold select-none shrink-0 transition-transform hover:scale-105 active:scale-95 cursor-default',
	{
		variants: {
			variant: {
				indigo: 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/20',
				'indigo-subtle':
					'bg-indigo-500/15 text-indigo-500 border border-indigo-500/20',
				warning: 'bg-warning/15 text-warning border border-warning/20',
				white: 'bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-sm',
				emerald:
					'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20',
				rose: 'bg-rose-500/15 text-rose-500 border border-rose-500/20',
			},
			size: {
				xs: 'text-[9px] px-2 py-0.5 gap-1',
				sm: 'text-[10px] px-2 py-1 gap-1',
				md: 'text-xs px-2.5 py-1 gap-1.5',
				lg: 'text-sm px-3 py-1.5 gap-1.5',
			},
			rounded: {
				sm: 'rounded-sm',
				md: 'rounded-md',
				lg: 'rounded-lg',
				xl: 'rounded-xl',
				full: 'rounded-full',
			},
		},
		defaultVariants: {
			variant: 'indigo',
			size: 'sm',
			rounded: 'full',
		},
	}
)

export type ProBadgeVariantProps = VariantProps<typeof proBadgeVariants>

export const vipBadgeVariants = proBadgeVariants
export type VipBadgeVariantProps = ProBadgeVariantProps
