import { cva } from 'class-variance-authority'

export const confirmationAccentBarVariants = cva(['h-1', 'w-full'], {
	variants: {
		variant: {
			danger: ['bg-ds-danger'],
			warning: ['bg-ds-warning'],
			info: ['bg-ds-info'],
			primary: ['bg-ds-brand'],
		},
	},
	defaultVariants: { variant: 'danger' },
})

export const confirmationIconVariants = cva(
	['flex', 'items-center', 'justify-center', 'rounded-full'],
	{
		variants: {
			variant: {
				danger: ['bg-ds-danger-fill', 'text-ds-danger'],
				warning: ['bg-ds-warning-fill', 'text-ds-warning'],
				info: ['bg-ds-info-fill', 'text-ds-info'],
				primary: ['bg-ds-brand-fill', 'text-ds-brand'],
			},
		},
		defaultVariants: { variant: 'danger' },
	}
)

export type ConfirmationVariant = typeof confirmationAccentBarVariants
