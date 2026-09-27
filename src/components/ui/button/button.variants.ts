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
				outline: 'bg-transparent hover:bg-ds-fill-2',
				ghost: 'bg-transparent border-transparent hover:bg-ds-fill-2',
				text: 'bg-transparent border-transparent hover:underline underline-offset-4',
			},
			color: {
				base: 'text-ds-fg',
				brand: 'text-ds-brand',
				primary: 'text-ds-brand',
				secondary: 'text-ds-secondary',
				danger: 'text-ds-danger',
				success: 'text-ds-success',
				info: 'text-ds-info',
				warning: 'text-ds-warning',
				vip: 'text-ds-vip',
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
				class: 'bg-ds-surface-2 border-ds-surface-3 hover:bg-ds-fill!',
			},
			{
				variant: 'solid',
				color: 'brand',
				class: 'bg-ds-brand text-ds-on-brand hover:bg-ds-brand-hover',
			},
			{
				variant: 'solid',
				color: 'primary',
				class: 'bg-ds-brand text-ds-on-brand hover:bg-ds-brand-hover',
			},
			{
				variant: 'solid',
				color: 'secondary',
				class: 'bg-ds-secondary text-ds-on-secondary hover:bg-[rgba(var(--color-secondary-rgb),0.9)]',
			},
			{
				variant: 'solid',
				color: 'danger',
				class: 'bg-ds-danger text-ds-on-danger hover:bg-[rgba(var(--color-error-rgb),0.9)]',
			},
			{
				variant: 'solid',
				color: 'success',
				class: 'bg-ds-success text-ds-on-success hover:bg-[rgba(var(--color-success-rgb),0.9)]',
			},
			{
				variant: 'solid',
				color: 'info',
				class: 'bg-ds-info text-ds-on-info hover:bg-[rgba(var(--color-info-rgb),0.9)]',
			},
			{
				variant: 'solid',
				color: 'warning',
				class: 'bg-ds-warning text-ds-on-warning hover:bg-[rgba(var(--color-warning-rgb),0.9)]',
			},
			{
				variant: 'solid',
				color: 'vip',
				class: 'bg-ds-vip text-ds-on-vip hover:bg-ds-vip-hover',
			},
			{
				variant: 'ghost',
				color: 'base',
				class: 'text-ds-fg-muted hover:text-ds-fg',
			},
			{ variant: 'outline', color: 'base', class: 'border-ds-surface-3' },
			{ variant: 'outline', color: 'brand', class: 'border-ds-brand' },
			{ variant: 'outline', color: 'primary', class: 'border-ds-brand' },
			{ variant: 'outline', color: 'secondary', class: 'border-ds-secondary' },
			{ variant: 'outline', color: 'danger', class: 'border-ds-danger' },
			{ variant: 'outline', color: 'success', class: 'border-ds-success' },
			{ variant: 'outline', color: 'info', class: 'border-ds-info' },
			{ variant: 'outline', color: 'warning', class: 'border-ds-warning' },
			{ variant: 'outline', color: 'vip', class: 'border-ds-vip' },
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
