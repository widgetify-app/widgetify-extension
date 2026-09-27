import { cva } from 'class-variance-authority'

export const confirmationIconVariants = cva(
	['flex', 'items-center', 'justify-center', 'rounded-full'],
	{
		variants: {
			variant: {
				danger: ['bg-danger-fill', 'text-danger'],
				warning: ['bg-warning-fill', 'text-warning'],
				info: ['bg-info-fill', 'text-info'],
				primary: ['bg-brand-fill', 'text-brand'],
			},
		},
		defaultVariants: { variant: 'danger' },
	}
)
