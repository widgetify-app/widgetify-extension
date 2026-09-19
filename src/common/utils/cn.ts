import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge<'wg-backdrop'>({
	extend: {
		classGroups: {
			'wg-backdrop': ['bg-glass'],

			'bg-color': [
				'bg-widget',
				'bg-widget-strong',
				'bg-widget-muted',
				'bg-widget-subtle',
				'bg-widget-faint',
				'bg-content',
				'bg-content-strong',
				'bg-content-muted',
				'bg-content-subtle',
				'bg-content-faint',
				'bg-raised',
				'bg-raised-strong',
				'bg-raised-muted',
				'bg-raised-subtle',
				'bg-raised-faint',
				'bg-subtle',
				'bg-hovered',
				'bg-strong',
			],
			'text-color': [
				'text-strong',
				'text-content',
				'text-muted',
				'text-subtle',
				'text-faint',
				'text-ghost',
			],
			'border-color': [
				'border-content',
				'border-content-subtle',
				'border-content-faint',
				'border-faint',
				'border-subtle',
				'border-muted',
				'border-strong',
			],

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
