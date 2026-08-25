import { cva, type VariantProps } from 'class-variance-authority'

export const proBadgeVariants = cva(
	'inline-flex items-center font-bold select-none shrink-0',
	{
		variants: {
			variant: {
				warning: 'bg-warning/15 text-warning',
				white: 'bg-white/20 text-white',
			},
			size: {
				xs: 'text-[9px] px-1.5 py-0.5 gap-1',
				sm: 'text-[10px] px-1.5 py-0.5 gap-1',
				md: 'text-xs px-2 py-0.5 gap-1.5',
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
			variant: 'warning',
			size: 'xs',
			rounded: 'lg',
		},
	}
)

export type ProBadgeVariantProps = VariantProps<typeof proBadgeVariants>
