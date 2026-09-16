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
				'bg-subtle',
				'bg-muted',
				'bg-strong',
				'bg-bold',
				'bg-overlay',
				'bg-knob',
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
				'border-faint',
				'border-subtle',
				'border-content',
				'border-strong',
				'border-bold',
			],
			'ring-color': ['ring-faint', 'ring-subtle', 'ring-content', 'ring-strong'],

			rounded: ['rounded-widget', 'rounded-card'],
			shadow: [
				'elevation-sm',
				'elevation-md',
				'elevation-lg',
				'elevation-xl',
				'elevation-2xl',
			],
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
				'z-toast',
				'z-pet',
			],
		},
	},
})

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}
