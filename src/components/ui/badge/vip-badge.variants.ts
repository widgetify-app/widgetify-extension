import { cva, type VariantProps } from 'class-variance-authority'

export const vipBadgeVariants = cva(
	'inline-flex items-center justify-center font-bold select-none shrink-0 transition-transform hover:scale-105 active:scale-95 cursor-default',
	{
		variants: {
			variant: {
				indigo: 'bg-[#0327aa] text-[#ffffff] shadow-sm shadow-[#0327aa]/25',
				'indigo-subtle':
					'bg-[#0327aa]/15 text-[#0327aa] border border-[#0327aa]/20',
				white: 'bg-white/20 text-white backdrop-blur-md border border-white/30 shadow-sm',
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

export type VipBadgeVariantProps = VariantProps<typeof vipBadgeVariants>

export const proBadgeVariants = vipBadgeVariants
export type ProBadgeVariantProps = VipBadgeVariantProps
