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
					'text-fg hover:bg-brand-fill hover:text-brand! active:bg-brand-fill-2!',
				danger: 'text-danger hover:bg-danger-fill active:bg-danger-fill-2',
				primary: 'text-brand bg-brand-fill hover:bg-brand-fill-2',
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
			default: 'text-fg-muted group-hover:text-brand!',
			danger: 'text-danger',
			primary: 'text-brand',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

export type DropdownItemVariantProps = VariantProps<typeof dropdownItemVariants>
