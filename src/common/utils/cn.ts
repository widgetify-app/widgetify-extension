import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge<'wg-backdrop'>({
	extend: {
		classGroups: {
			'wg-backdrop': ['bg-glass'],

			'bg-color': [
				'bg-widget',
				'bg-content',
				'bg-raised',
				'bg-hovered',
				'bg-strong',
			],
			'text-color': ['text-content', 'text-muted', 'text-subtle', 'text-faint'],
			'border-color': ['border-content', 'border-subtle', 'border-strong'],

			rounded: ['rounded-widget', 'rounded-card'],
			shadow: ['elevation-sm', 'elevation-lg'],
			transition: ['transition-ui'],
			'outline-style': ['focus-ring'],
			z: [
				'z-raised',
				'z-sticky',
				'z-drag',
				'z-nav',
				'z-backdrop',
				'z-sheet',
				'z-modal',
				'z-popover',
				'z-toast',
			],
		},
	},
})

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
