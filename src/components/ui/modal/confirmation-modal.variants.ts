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
				danger: ['bg-danger-subtle', 'text-error'],
				warning: ['bg-warning-subtle', 'text-warning'],
				info: ['bg-info-subtle', 'text-info'],
				primary: ['bg-brand-subtle', 'text-primary'],
			},
		},
		defaultVariants: { variant: 'danger' },
	}
)

export type ConfirmationVariant = typeof confirmationAccentBarVariants
