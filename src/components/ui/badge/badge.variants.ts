import { cva, type VariantProps } from 'class-variance-authority'

export const badgeVariants = cva(
	'inline-flex items-center justify-center font-medium select-none shrink-0 transition-colors',
	{
		variants: {
			variant: {
				error: 'badge badge-error text-white outline-2 outline-error/20',
				primary: 'badge badge-primary text-primary-content',
				secondary: 'badge badge-secondary text-secondary-content',
				neutral: 'badge badge-neutral',
				ghost: 'badge badge-ghost',
				dot: 'w-2 h-2 rounded-full bg-error animate-pulse ring-2 ring-error/20',
			},
			size: {
				xs: 'badge-xs',
				sm: 'badge-sm',
				md: 'badge-md',
				lg: 'badge-lg',
			},
		},
		defaultVariants: {
			variant: 'error',
			size: 'xs',
		},
	}
)

export type BadgeVariantProps = VariantProps<typeof badgeVariants>
