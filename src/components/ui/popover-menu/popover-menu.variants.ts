import { cva } from 'class-variance-authority'

export const popoverMenuVariants = cva([
	'bg-glass-surface-2',
	'rounded-2xl',
	'shadow-xl',
	'border',
	'border-line',
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
				default: 'text-fg hover:bg-fill-2 active:bg-surface-3',
				danger: 'text-danger hover:bg-danger-fill active:bg-danger-fill-2',
				primary: 'text-brand hover:bg-brand-fill active:bg-brand-fill-2',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)
