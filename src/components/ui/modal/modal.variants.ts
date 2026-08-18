import { cva } from 'class-variance-authority'

export const modalBoxVariants = cva(
	[
		'modal-box',
		'overflow-hidden',
		'rounded-widget',
		'p-3',
		'md:p-4',
		'elevation-lg',
		'transition-all',
		'duration-200',
	],
	{
		variants: {
			size: {
				sm: ['w-[calc(100vw-2rem)]', 'max-w-sm', 'min-h-[180px]'],
				md: ['w-[calc(100vw-2rem)]', 'max-w-md', 'min-h-[200px]'],
				lg: ['w-[calc(100vw-2rem)]', 'max-w-lg', 'min-h-[240px]'],
				xl: ['w-[calc(100vw-2rem)]', 'max-w-4xl', 'min-h-[280px]'],
				full: [
					'w-[calc(100vw-1rem)]',
					'max-w-5xl',
					'min-h-[calc(100vh-4rem)]',
					'h-[calc(100vh-4rem)]',
					'md:h-[calc(100vh-6rem)]',
				],
			},
		},
		defaultVariants: {
			size: 'md',
		},
	}
)

export type ModalBoxVariant = typeof modalBoxVariants

/**
 * The scrollable content area. This is what carries the per-size max-height —
 * `full` stretches to the box instead of capping.
 */
export const modalScrollVariants = cva(
	['overflow-y-auto', 'overflow-x-hidden', 'pr-0.5', 'md:pr-1'],
	{
		variants: {
			size: {
				sm: ['max-h-[calc(100vh-4rem)]', 'md:max-h-[560px]'],
				md: ['max-h-[calc(100vh-4rem)]', 'md:max-h-[640px]'],
				lg: ['max-h-[calc(100vh-4rem)]', 'md:max-h-[720px]'],
				xl: ['max-h-[calc(100vh-4rem)]', 'md:max-h-[800px]'],
				full: ['h-full'],
			},
		},
		defaultVariants: {
			size: 'md',
		},
	}
)

export type ModalScrollVariant = typeof modalScrollVariants
