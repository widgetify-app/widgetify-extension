import { cva } from 'class-variance-authority'

export const popoverMenuVariants = cva([
	'bg-content',
	'bg-glass',
	'rounded-3xl',
	'shadow-2xl',
	'border',
	'border-base-content/10',
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
				default: 'text-content hover:bg-base-content/10 active:bg-base-300',
				danger: 'text-error hover:bg-error/10 active:bg-error/20',
				primary: 'text-primary hover:bg-primary/10 active:bg-primary/20',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)
