import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge<'wg-backdrop'>({
	extend: {
		classGroups: {
			'wg-backdrop': ['bg-glass'],

			'bg-color': ['bg-widget', 'bg-content', 'bg-raised'],
			'text-color': ['text-strong', 'text-content', 'text-muted', 'text-subtle'],
			'border-color': ['border-content', 'border-strong'],

			rounded: ['rounded-widget', 'rounded-card'],
			shadow: ['elevation-sm', 'elevation', 'elevation-lg'],
			transition: ['transition-ui'],
			'outline-style': ['focus-ring'],
			z: [
				'z-base',
				'z-raised',
				'z-sticky',
				'z-drag',
				'z-nav',
				'z-backdrop',
				'z-sheet',
				'z-modal',
				'z-popover',
				'z-tooltip',
				'z-toast',
				'z-pet',
			],
		},
	},
})

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
