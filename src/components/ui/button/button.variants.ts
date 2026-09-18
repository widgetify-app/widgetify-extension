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
				solid: 'border-transparent',
				outline: 'bg-transparent hover:bg-raised',
				ghost: 'bg-transparent border-transparent hover:bg-raised',
				text: 'bg-transparent border-transparent hover:underline underline-offset-4',
			},
			color: {
				base: 'text-content',
				brand: 'text-brand',
				primary: 'text-primary',
				secondary: 'text-secondary',
				danger: 'text-error',
				success: 'text-success',
				info: 'text-info',
				warning: 'text-warning',
				vip: 'text-vip',
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
		compoundVariants: [
			{
				variant: 'solid',
				color: 'base',
				class: 'bg-content border-content hover:bg-raised!',
			},
			{
				variant: 'solid',
				color: 'brand',
				class: 'bg-brand text-brand-content hover:bg-brand-solid',
			},
			{
				variant: 'solid',
				color: 'primary',
				class: 'bg-primary text-primary-content hover:bg-brand-solid',
			},
			{
				variant: 'solid',
				color: 'secondary',
				class: 'bg-secondary text-secondary-content hover:bg-brand-solid',
			},
			{
				variant: 'solid',
				color: 'danger',
				class: 'bg-error text-error-content hover:bg-danger-solid',
			},
			{
				variant: 'solid',
				color: 'success',
				class: 'bg-success text-success-content hover:bg-success-solid',
			},
			{
				variant: 'solid',
				color: 'info',
				class: 'bg-info text-info-content hover:bg-info-solid',
			},
			{
				variant: 'solid',
				color: 'warning',
				class: 'bg-warning text-warning-content hover:bg-warning-solid',
			},
			{
				variant: 'solid',
				color: 'vip',
				class: 'bg-vip text-vip-content hover:bg-vip-solid',
			},
			{
				variant: 'ghost',
				color: 'base',
				class: 'text-muted hover:text-content',
			},
			{ variant: 'outline', color: 'base', class: 'border-content' },
			{ variant: 'outline', color: 'brand', class: 'border-brand-subtle' },
			{ variant: 'outline', color: 'primary', class: 'border-primary' },
			{ variant: 'outline', color: 'secondary', class: 'border-secondary' },
			{ variant: 'outline', color: 'danger', class: 'border-error' },
			{ variant: 'outline', color: 'success', class: 'border-success-subtle' },
			{ variant: 'outline', color: 'info', class: 'border-info-subtle' },
			{ variant: 'outline', color: 'warning', class: 'border-warning-subtle' },
			{ variant: 'outline', color: 'vip', class: 'border-vip-subtle' },
		],
		defaultVariants: {
			variant: 'solid',
			color: 'base',
			size: 'md',
			rounded: 'card',
			fullWidth: false,
		},
	}
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
