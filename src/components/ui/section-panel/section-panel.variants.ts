import { cva } from 'class-variance-authority'

/**
 * Four slots scale together, so each gets its own cva keyed on the same `size`.
 * (cva has no multi-slot support — that is tailwind-variants — and four small
 * configs stay more readable than encoding slot names into one class string.)
 */

export const sectionPanelVariants = cva(['overflow-hidden', 'duration-300'], {
	variants: {
		size: {
			xs: ['rounded-sm'],
			sm: ['rounded-lg'],
			md: ['rounded-xl'],
			lg: ['rounded-xl'],
		},
	},
	defaultVariants: { size: 'md' },
})

export const sectionPanelHeaderVariants = cva(['border-b', 'border-content'], {
	variants: {
		size: {
			xs: ['p-1'],
			sm: ['p-3'],
			md: ['p-4'],
			lg: ['p-5'],
		},
	},
	defaultVariants: { size: 'md' },
})

export const sectionPanelTitleVariants = cva(['font-medium', 'text-content'], {
	variants: {
		size: {
			xs: ['text-sm'],
			sm: ['text-base'],
			md: ['text-lg'],
			lg: ['text-xl'],
		},
	},
	defaultVariants: { size: 'md' },
})

export const sectionPanelContentVariants = cva([], {
	variants: {
		size: {
			xs: ['p-1'],
			sm: ['p-3'],
			md: ['p-4'],
			lg: ['p-5'],
		},
	},
	defaultVariants: { size: 'md' },
})

export type SectionPanelVariant = typeof sectionPanelVariants
