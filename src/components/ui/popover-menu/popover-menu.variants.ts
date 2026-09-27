import { cva } from 'class-variance-authority'

export const popoverMenuVariants = cva([
	'bg-ds-surface-2',
	'bg-glass',
	'rounded-3xl',
	'shadow-2xl',
	'border',
	'border-ds-line',
	'p-2',
	'text-right',
	'text-xs',
	'flex',
	'flex-col',
	'gap-1',
	'animate-in',
	'fade-in',
	'zoom-in-95',
	'duration-150',
])

export const popoverMenuItemVariants = cva(
	[
		'flex',
		'items-center',
		'justify-between',
		'w-full',
		'px-2.5',
		'py-2',
		'rounded-xl',
		'font-medium',
		'transition-colors',
		'text-right',
		'cursor-pointer',
		'disabled:opacity-40',
		'disabled:cursor-not-allowed',
	],
	{
		variants: {
			variant: {
				default: 'text-ds-fg hover:bg-ds-fill-2 active:bg-ds-surface-3',
				danger: 'text-ds-danger hover:bg-ds-danger-fill active:bg-ds-danger-fill-2',
				primary: 'text-ds-brand hover:bg-ds-brand-fill active:bg-ds-brand-fill-2',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)
