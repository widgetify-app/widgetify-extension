import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Button variants.
 *
 * cva declares WHICH classes a variant contributes. It never merges — merging
 * is `cn()`'s job (see common/utils/cn.ts).
 *
 * Sizes mirror daisyUI's `--size-field * n` ladder (24/32/40/48/56px) and its
 * padding/font ramp on purpose: a call site migrating off `btn` keeps its exact
 * geometry, so the only thing that changes is colour — which is the part worth
 * reviewing.
 *
 * Colour comes from the project's semantic tokens, never from `btn-*`.
 */
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
				default: 'bg-content text-content border-content hover:bg-raised',
				primary:
					'bg-primary text-primary-content border-transparent hover:bg-primary/90',
				secondary:
					'bg-secondary text-secondary-content border-transparent hover:bg-secondary/90',
				outline: 'bg-transparent text-content border-content hover:bg-raised',
				ghost: 'bg-transparent text-muted border-transparent hover:bg-raised hover:text-content',
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
			/**
			 * Literal class names only. The previous implementation built
			 * `rounded-${prop.rounded}` at runtime, which Tailwind v4's source
			 * scanner cannot see — those classes only shipped by coincidence,
			 * when the same literal happened to appear elsewhere in the codebase.
			 */
			rounded: {
				sm: 'rounded-sm',
				md: 'rounded-md',
				lg: 'rounded-lg',
				xl: 'rounded-xl',
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
