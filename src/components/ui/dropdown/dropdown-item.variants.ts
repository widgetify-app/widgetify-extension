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
					'text-ds-fg hover:bg-ds-brand-fill hover:text-ds-brand! active:bg-ds-brand-fill-2!',
				danger: 'text-ds-danger hover:bg-ds-danger-fill active:bg-ds-danger-fill-2',
				primary: 'text-ds-brand bg-ds-brand-fill hover:bg-ds-brand-fill-2',
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
			default: 'text-ds-fg-muted group-hover:text-ds-brand!',
			danger: 'text-ds-danger',
			primary: 'text-ds-brand',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

export type DropdownItemVariantProps = VariantProps<typeof dropdownItemVariants>
