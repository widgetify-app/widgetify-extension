import { cva } from 'class-variance-authority'

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
