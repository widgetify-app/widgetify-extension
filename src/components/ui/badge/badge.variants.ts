import { cva, type VariantProps } from 'class-variance-authority'

export const badgeVariants = cva(
	'badge inline-flex items-center justify-center font-medium select-none shrink-0',
	{
		variants: {
			variant: {
				danger: 'badge-error text-on-danger outline-2 outline-danger-fill-2',
				neutral: 'badge-neutral',
				ghost: 'badge-ghost',
			},
			size: {
				xs: 'badge-xs',
				sm: 'badge-sm',
			},
		},
		defaultVariants: {
			variant: 'danger',
			size: 'xs',
		},
	}
)

export type BadgeVariantProps = VariantProps<typeof badgeVariants>
