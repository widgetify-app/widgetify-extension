import { cva } from 'class-variance-authority'

export const popoverMenuVariants = cva([
	'bg-content',
	'bg-glass',
	'rounded-3xl',
	'shadow-2xl',
	'border',
	'border-subtle',
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
				default: 'text-content hover:bg-hovered active:bg-raised',
				danger: 'text-error hover:bg-danger-subtle active:bg-danger-subtle',
				primary: 'text-primary hover:bg-brand-subtle active:bg-brand-subtle',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	}
)
