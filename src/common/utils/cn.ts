import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge<'wg-backdrop'>({
	extend: {
		classGroups: {
			'wg-backdrop': ['bg-glass'],

			rounded: ['rounded-widget'],
			transition: ['transition-ui'],
			'outline-style': ['focus-ring'],
			z: ['z-float', 'z-nav', 'z-toolbar', 'z-popover', 'z-dropdown'],
		},
	},
})

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
