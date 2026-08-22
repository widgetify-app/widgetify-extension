import { cva, type VariantProps } from 'class-variance-authority'

export const buttonVariants = cva(
	[
		'inline-flex shrink-0 items-center justify-center gap-1.5',
		'whitespace-nowrap align-middle select-none cursor-pointer',
		'border font-semibold',
		'transition-ui',
		'focus-visible:focus-ring',
		'disabled:pointer-events-none disabled:opacity-50',
	],
	{
		variants: {
			variant: {
				default:
					'bg-content text-content border-content hover:bg-base-content/5!',
				primary: 'bg-primary text-white border-transparent hover:bg-primary/90',
				secondary:
					'bg-secondary text-secondary-content border-transparent hover:bg-secondary/90',
				outline: 'bg-transparent text-content border-content hover:bg-raised',
				ghost: 'bg-transparent text-base-content/80 border-transparent hover:bg-base-100! hover:text-content!',
				danger: 'bg-error text-error-content border-transparent hover:bg-error/90',
				success:
					'bg-success text-success-content border-transparent hover:bg-success/90',
			},
			size: {
				xs: 'h-6 px-2 text-[0.6875rem]',
				sm: 'h-8 px-3 text-xs',
				md: 'h-10 px-4 text-sm',
				lg: 'h-12 px-5 text-lg',
				xl: 'h-14 px-6 text-[1.375rem]',
			},
			rounded: {
				sm: 'rounded-sm',
				md: 'rounded-md',
				lg: 'rounded-lg',
				xl: 'rounded-xl',
				'2xl': 'rounded-2xl',
				full: 'rounded-full',
				card: 'rounded-card',
			},
			fullWidth: {
				true: 'w-full',
				false: '',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'md',
			rounded: 'card',
			fullWidth: false,
		},
	}
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
