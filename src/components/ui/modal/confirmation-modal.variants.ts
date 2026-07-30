import { cva } from 'class-variance-authority'

/**
 * Confirmation modal accent colours.
 *
 * Four slots share one `variant` key. The icon element itself stays in the
 * component — cva describes classes, not JSX.
 */

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

export const confirmationConfirmButtonVariants = cva([], {
	variants: {
		variant: {
			danger: ['bg-error', 'hover:bg-error/90', 'text-error-content'],
			warning: ['bg-warning', 'hover:bg-warning/90', 'text-warning-content'],
			info: ['bg-info/80', 'hover:bg-info/90', 'text-info-content'],
			primary: ['bg-primary/80', 'hover:bg-primary/90', 'text-primary-content'],
		},
	},
	defaultVariants: { variant: 'danger' },
})

export type ConfirmationVariant = typeof confirmationAccentBarVariants
