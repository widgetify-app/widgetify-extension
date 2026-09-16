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
		'focus-visible:focus-ring',
		'disabled:opacity-(--disabled-opacity)',
		'disabled:pointer-events-none',
		'disabled:cursor-not-allowed',
	],
	{
		variants: {
			variant: {
				default:
					'text-content hover:bg-primary/10 hover:text-primary! active:bg-primary/20!',
				danger: 'text-error hover:bg-error/10 active:bg-error/20',
				primary: 'text-primary bg-primary/10 hover:bg-primary/20',
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
