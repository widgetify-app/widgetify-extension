import { cva } from 'class-variance-authority'

export const spinnerVariants = cva('block shrink-0 rounded-full animate-spin', {
	variants: {
		size: {
			xs: 'w-3 h-3 border-2',
			sm: 'w-4 h-4 border-2',
			md: 'w-5 h-5 border-2',
			lg: 'w-6 h-6 border-2',
			xl: 'w-8 h-8 border-4',
			'2xl': 'w-10 h-10 border-4',
		},
		tone: {
			brand: 'border-brand-fill-2 border-t-brand',
			current: 'border-current border-t-transparent',
			image: 'border-image-line border-t-image-fg',
		},
	},
	defaultVariants: {
		size: 'md',
		tone: 'brand',
	},
})
