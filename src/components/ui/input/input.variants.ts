import { cva, type VariantProps } from 'class-variance-authority'

export const textInputVariants = cva(
	[
		'w-full inline-flex items-center',
		'bg-surface-2 text-fg',
		'border border-surface-3 rounded-xl',
		'font-light',
		'transition-ui',
		'placeholder:text-fg-faint',
		'outline-none focus:outline-none',
		'focus:border-brand focus:ring-1 focus:ring-brand-fill-2',
		'disabled:cursor-not-allowed disabled:opacity-50',
	],
	{
		variants: {
			size: {
				xs: 'h-6 px-2 text-2xs',
				sm: 'h-8 px-3 text-xs',
				md: 'h-10 px-3 text-sm',
				lg: 'h-12 px-4 text-lg',
				xl: 'h-14 px-4 text-[1.375rem]',
			},
			invalid: {
				true: 'border-danger focus:border-danger focus:ring-danger-fill-2',
				false: '',
			},
		},
		defaultVariants: {
			size: 'md',
			invalid: false,
		},
	}
)

type TextInputVariantProps = VariantProps<typeof textInputVariants>

/**
 * Replaces the old `TextInputSize` enum, which was never exported (so it could
 * not be part of the public API) and which no call site passed. A string union
 * is a pure widening — `size="sm"` becomes newly legal, nothing breaks — and it
 * avoids shipping an enum's runtime object.
 */
export type TextInputSize = NonNullable<TextInputVariantProps['size']>
