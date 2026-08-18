import { cva, type VariantProps } from 'class-variance-authority'

export const textInputVariants = cva(
	[
		'w-full inline-flex items-center',
		'bg-content text-content',
		'border border-content rounded-xl',
		'font-light',
		'transition-ui',
		'placeholder:text-subtle',
		'outline-none focus:outline-none',
		'focus:border-primary focus:ring-1 focus:ring-primary/20',
		'disabled:cursor-not-allowed disabled:opacity-50',
	],
	{
		variants: {
			size: {
				xs: 'h-6 px-2 text-[0.6875rem]',
				sm: 'h-8 px-3 text-xs',
				md: 'h-10 px-3 text-sm',
				lg: 'h-12 px-4 text-lg',
				xl: 'h-14 px-4 text-[1.375rem]',
			},
			invalid: {
				true: 'border-error focus:border-error focus:ring-error/20',
				false: '',
			},
		},
		defaultVariants: {
			size: 'md',
			invalid: false,
		},
	}
)

export type TextInputVariantProps = VariantProps<typeof textInputVariants>

/**
 * Replaces the old `TextInputSize` enum, which was never exported (so it could
 * not be part of the public API) and which no call site passed. A string union
 * is a pure widening — `size="sm"` becomes newly legal, nothing breaks — and it
 * avoids shipping an enum's runtime object.
 */
export type TextInputSize = NonNullable<TextInputVariantProps['size']>
