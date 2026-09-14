import { cva } from 'class-variance-authority'

export const confirmationAccentBarVariants = cva(['h-1', 'w-full'], {
	variants: {
		variant: {
			danger: ['bg-error'],
			warning: ['bg-warning'],
			info: ['bg-info'],
			primary: ['bg-primary'],
		},
	},
	defaultVariants: { variant: 'danger' },
})

export const confirmationIconVariants = cva(
	['flex', 'items-center', 'justify-center', 'rounded-full'],
	{
		variants: {
			variant: {
				danger: ['bg-error/10', 'text-error'],
				warning: ['bg-warning/10', 'text-warning'],
				info: ['bg-info/10', 'text-info'],
				primary: ['bg-primary/10', 'text-primary'],
			},
		},
		defaultVariants: { variant: 'danger' },
	}
)

export type ConfirmationVariant = typeof confirmationAccentBarVariants
