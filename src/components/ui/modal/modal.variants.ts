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
		'duration-[var(--modal-duration,300ms)]',
		'transition-discrete',
		'opacity-0',
		'scale-95',
		'group-open:opacity-100',
		'group-open:scale-100',
		'starting:group-open:opacity-0',
		'starting:group-open:scale-95',
	],
	{
		variants: {
			size: {
				sm: ['w-[calc(100vw-2rem)]', 'max-w-sm', 'min-h-[180px]'],
				md: ['w-[calc(100vw-2rem)]', 'max-w-md', 'min-h-[200px]'],
				lg: ['w-[calc(100vw-2rem)]', 'max-w-lg', 'min-h-[240px]'],
				xl: ['w-[calc(100vw-2rem)]', 'max-w-4xl', 'min-h-[280px]'],
				'2xl': ['w-[calc(100vw-2rem)]', 'max-w-5xl', 'min-h-[320px]'],
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

export const modalScrollVariants = cva(
	['overflow-y-auto', 'overflow-x-hidden', 'pr-0.5', 'md:pr-1'],
	{
		variants: {
			size: {
				sm: ['max-h-[calc(100vh-4rem)]', 'md:max-h-[560px]'],
				md: ['max-h-[calc(100vh-4rem)]', 'md:max-h-[640px]'],
				lg: ['max-h-[calc(100vh-4rem)]', 'md:max-h-[720px]'],
				xl: ['max-h-[calc(100vh-4rem)]', 'md:max-h-[800px]'],
				'2xl': ['max-h-[calc(100vh-4rem)]', 'md:max-h-[850px]'],
				full: ['h-full'],
			},
		},
		defaultVariants: {
			size: 'md',
		},
	}
)

export type ModalScrollVariant = typeof modalScrollVariants

export const modalDialogVariants = cva(['modal', 'modal-middle', 'group', 'p-2', 'md:p-4'])

export type ModalDialogVariant = typeof modalDialogVariants
