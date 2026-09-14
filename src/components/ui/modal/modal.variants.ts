import { cva } from 'class-variance-authority'

export const modalBoxVariants = cva(
	[
		'modal-box',
		'overflow-hidden',
		'max-h-[calc(100dvh-1rem)]',
		'md:max-h-[calc(100dvh-2rem)]',
		'rounded-widget',
		'p-3',
		'md:p-4',
		'elevation-lg',
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
	['overflow-y-auto', 'overflow-x-hidden', 'px-0.5', 'md:px-1'],
	{
		variants: {
			size: {
				sm: [
					'max-h-[calc(100dvh-6rem)]',
					'md:max-h-[min(560px,calc(100dvh-8rem))]',
				],
				md: [
					'max-h-[calc(100dvh-6rem)]',
					'md:max-h-[min(640px,calc(100dvh-8rem))]',
				],
				lg: [
					'max-h-[calc(100dvh-6rem)]',
					'md:max-h-[min(720px,calc(100dvh-8rem))]',
				],
				xl: [
					'max-h-[calc(100dvh-6rem)]',
					'md:max-h-[min(800px,calc(100dvh-8rem))]',
				],
				'2xl': [
					'max-h-[calc(100dvh-6rem)]',
					'md:max-h-[min(850px,calc(100dvh-8rem))]',
				],
				full: ['h-full'],
			},
		},
		defaultVariants: {
			size: 'md',
		},
	}
)

export type ModalScrollVariant = typeof modalScrollVariants

export const modalDialogVariants = cva([
	'modal',
	'modal-middle',
	'p-2',
	'md:p-4',
])

export type ModalDialogVariant = typeof modalDialogVariants
