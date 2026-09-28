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
				outline: 'bg-transparent hover:bg-fill-2',
				ghost: 'bg-transparent border-transparent hover:bg-fill-2',
			},
			color: {
				base: 'text-fg',
				brand: 'text-brand',
				danger: 'text-danger',
				success: 'text-success',
				warning: 'text-warning',
				vip: 'text-vip',
			},
			size: {
				xs: 'h-6 px-2 text-2xs',
				sm: 'h-8 px-3 text-xs',
				md: 'h-10 px-4 text-sm',
				lg: 'h-12 px-5 text-lg',
			},
			rounded: {
				lg: 'rounded-lg',
				xl: 'rounded-xl',
				'2xl': 'rounded-2xl',
				full: 'rounded-full',
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
				class: 'bg-surface-2 border-surface-3 hover:bg-fill!',
			},
			{
				variant: 'solid',
				color: 'brand',
				class: 'bg-brand text-on-brand hover:bg-brand-hover',
			},
			{
				variant: 'solid',
				color: 'danger',
				class: 'bg-danger text-on-danger hover:bg-[rgba(var(--color-error-rgb),0.9)]',
			},
			{
				variant: 'solid',
				color: 'success',
				class: 'bg-success text-on-success hover:bg-[rgba(var(--color-success-rgb),0.9)]',
			},
			{
				variant: 'solid',
				color: 'warning',
				class: 'bg-warning text-on-warning hover:bg-[rgba(var(--color-warning-rgb),0.9)]',
			},
			{
				variant: 'solid',
				color: 'vip',
				class: 'bg-vip text-on-vip hover:bg-vip-hover',
			},
			{
				variant: 'ghost',
				color: 'base',
				class: 'text-fg-muted hover:text-fg',
			},
			{ variant: 'outline', color: 'base', class: 'border-surface-3' },
			{ variant: 'outline', color: 'brand', class: 'border-brand' },
			{ variant: 'outline', color: 'danger', class: 'border-danger' },
			{ variant: 'outline', color: 'success', class: 'border-success' },
			{ variant: 'outline', color: 'warning', class: 'border-warning' },
			{ variant: 'outline', color: 'vip', class: 'border-vip' },
		],
		defaultVariants: {
			variant: 'solid',
			color: 'base',
			size: 'md',
			rounded: '2xl',
			fullWidth: false,
		},
	}
)

export type ButtonVariantProps = VariantProps<typeof buttonVariants>
