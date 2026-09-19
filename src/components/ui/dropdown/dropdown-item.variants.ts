import { cva, type VariantProps } from 'class-variance-authority'

export const dropdownItemVariants = cva(
	[
		'flex',
		'items-center',
		'justify-between',
		'w-full',
		'px-3.5',
		'py-2',
		'text-xs',
		'text-right',
		'transition-colors',
		'cursor-pointer',
		'group',
		'rounded-xl',
		'select-none',
		'disabled:opacity-50',
		'disabled:pointer-events-none',
		'disabled:cursor-not-allowed',
	],
	{
		variants: {
			variant: {
				default:
					'text-content hover:bg-brand-subtle hover:text-primary! active:bg-brand-muted!',
				danger: 'text-error hover:bg-danger-subtle active:bg-danger-muted',
				primary: 'text-primary bg-brand-subtle hover:bg-brand-muted',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)

export const dropdownItemIconVariants = cva(['transition-colors', 'shrink-0'], {
	variants: {
		variant: {
			default: 'text-muted group-hover:text-primary!',
			danger: 'text-error',
			primary: 'text-primary',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

export type DropdownItemVariantProps = VariantProps<typeof dropdownItemVariants>
