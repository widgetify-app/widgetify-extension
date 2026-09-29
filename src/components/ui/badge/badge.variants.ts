import { cva, type VariantProps } from 'class-variance-authority'

export const badgeVariants = cva(
	'inline-flex items-center justify-center font-medium select-none shrink-0',
	{
		variants: {
			variant: {
				danger: 'badge badge-error badge-xs text-on-danger outline-2 outline-danger-fill-2',
				dot: 'w-2 h-2 rounded-full bg-danger animate-pulse ring-2 ring-danger-fill-2',
			},
		},
		defaultVariants: {
			variant: 'danger',
		},
	}
)

export type BadgeVariantProps = VariantProps<typeof badgeVariants>
