import { cva, type VariantProps } from 'class-variance-authority'

const FIELD_BASE = [
	'bg-surface-2 text-fg',
	'border border-surface-3 rounded-xl',
	'font-light',
	'transition-ui',
	'placeholder:text-fg-faint',
	'outline-none focus:outline-none',
	'focus:border-brand focus:ring-1 focus:ring-brand-fill-2',
	'disabled:cursor-not-allowed disabled:opacity-50',
]

export const textInputVariants = cva(['w-full inline-flex items-center', ...FIELD_BASE], {
	variants: {
		size: {
			sm: 'h-8 px-3 text-xs',
			md: 'h-10 px-3 text-sm',
		},
		invalid: {
			true: 'border-danger focus:border-danger focus:ring-danger-fill-2',
			false: '',
		},
		variant: {
			field: '',
			bare: 'h-auto p-0 bg-transparent border-none rounded-none focus:ring-0',
		},
	},
	defaultVariants: {
		size: 'md',
		invalid: false,
		variant: 'field',
	},
})

export const textAreaVariants = cva([
	'w-full px-3 py-2 text-xs leading-relaxed resize-none',
	...FIELD_BASE,
])

type TextInputVariantProps = VariantProps<typeof textInputVariants>

/**
 * Replaces the old `TextInputSize` enum, which was never exported (so it could
 * not be part of the public API) and which no call site passed. A string union
 * is a pure widening — `size="sm"` becomes newly legal, nothing breaks — and it
 * avoids shipping an enum's runtime object.
 */
export type TextInputSize = NonNullable<TextInputVariantProps['size']>
export type TextInputVariant = NonNullable<TextInputVariantProps['variant']>
